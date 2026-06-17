const router  = require("express").Router();
const multer  = require("multer");
const path    = require("path");
const { PrismaClient } = require("@prisma/client");
const { requireAuth, requireRole } = require("../middleware/auth");
const { sendStatusEmail } = require("../utils/mailer");
const { nextRequestNumber } = require("../utils/counter");

const prisma = new PrismaClient();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".docx", ".doc", ".png", ".jpg", ".jpeg"];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

// GET /api/requests
// Сотрудник видит только свои, HR-специалист — все заявки компании
router.get("/", requireAuth, async (req, res) => {
  const isHR = ["HR_SPECIALIST", "HR_DIRECTOR", "ADMIN"].includes(req.user.role);
  const { status, page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const where = {
      companyId: req.user.companyId,
      ...(status && { status }),
      ...(!isHR && { requesterId: req.user.id }),
    };

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: {
          service:    { select: { title: true, icon: true, category: true } },
          requester:  { select: { fullName: true, department: true } },
          assignee:   { select: { fullName: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.request.count({ where }),
    ]);

    res.json({ data: requests, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/requests — создать заявку
router.post("/", requireAuth, async (req, res) => {
  const { serviceId, fields = [], comment } = req.body;
  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return res.status(404).json({ error: "Service not found" });

    const number      = await nextRequestNumber();
    const slaDeadline = new Date(Date.now() + service.slaDays * 86_400_000);

    const request = await prisma.request.create({
      data: {
        number,
        companyId:   req.user.companyId,
        serviceId,
        requesterId: req.user.id,
        status:      "SENT",
        slaDeadline,
        fields: {
          create: [
            ...fields.map(f => ({ fieldName: f.name, fieldValue: f.value })),
            ...(comment ? [{ fieldName: "comment", fieldValue: comment }] : []),
          ],
        },
        statusLogs: {
          create: { fromStatus: "DRAFT", toStatus: "SENT", changedBy: req.user.id },
        },
      },
      include: { service: true, fields: true },
    });

    await sendStatusEmail(req.user, request, "SENT");
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const request = await prisma.request.findUnique({
      where: { id: req.params.id },
      include: {
        service:     true,
        requester:   { select: { fullName: true, email: true, department: true } },
        assignee:    { select: { fullName: true, email: true } },
        fields:      true,
        comments:    { include: { author: { select: { fullName: true, role: true } } }, orderBy: { createdAt: "asc" } },
        attachments: true,
        statusLogs:  { include: { user: { select: { fullName: true } } }, orderBy: { changedAt: "asc" } },
      },
    });

    if (!request) return res.status(404).json({ error: "Not found" });

    const isOwner = request.requesterId === req.user.id;
    const isHR    = ["HR_SPECIALIST", "HR_DIRECTOR", "ADMIN"].includes(req.user.role);
    if (!isOwner && !isHR) return res.status(403).json({ error: "Forbidden" });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/requests/:id/status  [HR]
router.patch("/:id/status", requireAuth, requireRole("HR_SPECIALIST", "HR_DIRECTOR", "ADMIN"), async (req, res) => {
  const { status } = req.body;
  const VALID = ["DRAFT","SENT","REVIEW","ASSIGNED","INWORK","DONE","CLOSED"];
  if (!VALID.includes(status)) return res.status(400).json({ error: "Invalid status" });

  try {
    const existing = await prisma.request.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const request = await prisma.request.update({
      where: { id: req.params.id },
      data: {
        status,
        statusLogs: {
          create: { fromStatus: existing.status, toStatus: status, changedBy: req.user.id },
        },
      },
      include: { requester: true, service: true },
    });

    await sendStatusEmail(request.requester, request, status);
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/requests/:id/assign  [HR]
router.post("/:id/assign", requireAuth, requireRole("HR_SPECIALIST", "HR_DIRECTOR", "ADMIN"), async (req, res) => {
  const { assigneeId } = req.body;
  try {
    const request = await prisma.request.update({
      where: { id: req.params.id },
      data: {
        assigneeId,
        status: "ASSIGNED",
        statusLogs: {
          create: { toStatus: "ASSIGNED", changedBy: req.user.id },
        },
      },
    });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests/:id/comments
router.get("/:id/comments", requireAuth, async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { requestId: req.params.id },
      include: { author: { select: { fullName: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/requests/:id/comments
router.post("/:id/comments", requireAuth, async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: "Comment body required" });
  try {
    const comment = await prisma.comment.create({
      data: { requestId: req.params.id, authorId: req.user.id, body },
      include: { author: { select: { fullName: true, role: true } } },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/requests/:id/attachments
router.post("/:id/attachments", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File required" });
  try {
    const attachment = await prisma.attachment.create({
      data: {
        requestId:  req.params.id,
        filename:   req.file.originalname,
        storageKey: req.file.filename,
        sizeBytes:  req.file.size,
      },
    });
    res.status(201).json(attachment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests/:id/attachments
router.get("/:id/attachments", requireAuth, async (req, res) => {
  try {
    const attachments = await prisma.attachment.findMany({ where: { requestId: req.params.id } });
    res.json(attachments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

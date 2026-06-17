const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { requireAuth, requireRole } = require("../middleware/auth");

const prisma = new PrismaClient();

// GET /api/services  — список сервисов (глобальные + компании пользователя)
router.get("/", requireAuth, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        OR: [
          { companyId: null },
          { companyId: req.user.companyId },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { category: "asc" }],
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/services/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) return res.status(404).json({ error: "Not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/services  [admin]
router.post("/", requireAuth, requireRole("ADMIN", "HR_DIRECTOR"), async (req, res) => {
  const { category, icon, title, description, slaDays, whoCan, docsNeeded, companyId } = req.body;
  try {
    const service = await prisma.service.create({
      data: { category, icon, title, description, slaDays, whoCan, docsNeeded, companyId: companyId || null },
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/services/:id  [admin]
router.put("/:id", requireAuth, requireRole("ADMIN", "HR_DIRECTOR"), async (req, res) => {
  const { category, icon, title, description, slaDays, whoCan, docsNeeded, isActive, sortOrder } = req.body;
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: { category, icon, title, description, slaDays, whoCan, docsNeeded, isActive, sortOrder },
    });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/services/:id  — мягкое удаление [admin]
router.delete("/:id", requireAuth, requireRole("ADMIN", "HR_DIRECTOR"), async (req, res) => {
  try {
    await prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

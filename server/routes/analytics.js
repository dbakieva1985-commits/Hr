const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { requireAuth, requireRole } = require("../middleware/auth");

const prisma = new PrismaClient();

// GET /api/analytics?from=2026-01-01&to=2026-06-30&companyId=...
router.get("/", requireAuth, requireRole("HR_SPECIALIST", "HR_DIRECTOR", "ADMIN"), async (req, res) => {
  const companyId = req.query.companyId || req.user.companyId;
  const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30 * 86_400_000);
  const to   = req.query.to   ? new Date(req.query.to)   : new Date();

  const where = {
    companyId,
    createdAt: { gte: from, lte: to },
  };

  try {
    const [total, done, overSLA, byService] = await Promise.all([
      prisma.request.count({ where }),

      prisma.request.count({ where: { ...where, status: { in: ["DONE", "CLOSED"] } } }),

      // просрочено: дедлайн прошёл, а статус ещё не DONE/CLOSED
      prisma.request.count({
        where: {
          ...where,
          slaDeadline: { lt: new Date() },
          status: { notIn: ["DONE", "CLOSED"] },
        },
      }),

      // топ-5 сервисов
      prisma.request.groupBy({
        by: ["serviceId"],
        where,
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    const slaPct = total > 0 ? Math.round(((total - overSLA) / total) * 100) : 100;

    // обогатить топ-сервисы названиями
    const serviceIds = byService.map(r => r.serviceId);
    const services   = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, title: true, icon: true },
    });
    const serviceMap = Object.fromEntries(services.map(s => [s.id, s]));

    const topServices = byService.map(r => ({
      serviceId: r.serviceId,
      title:     serviceMap[r.serviceId]?.title,
      icon:      serviceMap[r.serviceId]?.icon,
      count:     r._count.id,
    }));

    res.json({
      period: { from, to },
      total,
      done,
      slaPct,
      overSLA,
      topServices,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/sla  — детальный SLA по каждому сервису
router.get("/sla", requireAuth, requireRole("HR_SPECIALIST", "HR_DIRECTOR", "ADMIN"), async (req, res) => {
  const companyId = req.query.companyId || req.user.companyId;
  try {
    const rows = await prisma.request.groupBy({
      by: ["serviceId", "status"],
      where: { companyId },
      _count: { id: true },
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

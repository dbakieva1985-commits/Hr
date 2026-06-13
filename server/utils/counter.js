const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function nextRequestNumber() {
  const last = await prisma.request.findFirst({ orderBy: { createdAt: "desc" } });
  if (!last) return "HR-001";
  const n = parseInt(last.number.replace("HR-", ""), 10) + 1;
  return `HR-${String(n).padStart(3, "0")}`;
}

module.exports = { nextRequestNumber };

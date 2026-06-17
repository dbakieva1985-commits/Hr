const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.upsert({
    where:  { slug: "halyk-bank" },
    update: {},
    create: { name: "Халык Банк", slug: "halyk-bank", contour: "internal" },
  });

  const hash = await bcrypt.hash("demo1234", 10);

  await prisma.user.upsert({
    where:  { email: "fi.firuza.97@gmail.com" },
    update: {},
    create: {
      companyId:  company.id,
      email:      "fi.firuza.97@gmail.com",
      fullName:   "Фируза",
      department: "ДУП",
      role:       "HR_SPECIALIST",
      password:   hash,
    },
  });

  await prisma.user.upsert({
    where:  { email: "employee@halyk.kz" },
    update: {},
    create: {
      companyId:  company.id,
      email:      "employee@halyk.kz",
      fullName:   "Иван Иванов",
      department: "Розничный бизнес",
      role:       "EMPLOYEE",
      password:   hash,
    },
  });

  const services = [
    { category: "Кадровое администрирование", icon: "🏖", title: "Заявка на отпуск",       slaDays: 1, whoCan: "Любой сотрудник",             docsNeeded: "Не требуются" },
    { category: "Кадровое администрирование", icon: "🔄", title: "Заявка на перевод",       slaDays: 3, whoCan: "Сотрудник / руководитель",     docsNeeded: "Заявка с обоснованием" },
    { category: "Кадровое администрирование", icon: "📄", title: "Справка с места работы",  slaDays: 1, whoCan: "Любой сотрудник",             docsNeeded: "Не требуются" },
    { category: "Подбор персонала",           icon: "🔍", title: "Заявка на подбор",        slaDays: 5, whoCan: "Руководитель подразделения",   docsNeeded: "Описание вакансии, грейд" },
    { category: "Compensation & Benefits",    icon: "💰", title: "Заявка на премирование",  slaDays: 3, whoCan: "Руководитель подразделения",   docsNeeded: "Обоснование, сумма" },
    { category: "Обучение и развитие",        icon: "📚", title: "Заявка на обучение",      slaDays: 3, whoCan: "Любой сотрудник / руководитель", docsNeeded: "Название курса, провайдер" },
    { category: "HR Analytics",               icon: "📊", title: "Запрос HR-отчёта",        slaDays: 2, whoCan: "Руководитель / HR",            docsNeeded: "Описание данных и периода" },
    { category: "Оценка и Performance",       icon: "🎯", title: "Запуск оценки 360",       slaDays: 5, whoCan: "Руководитель / HR",            docsNeeded: "Список участников" },
  ];

  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({
      where:  { id: `seed-service-${i + 1}` },
      update: {},
      create: { id: `seed-service-${i + 1}`, ...s, companyId: null, sortOrder: i },
    });
  }

  console.log("Seed complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());

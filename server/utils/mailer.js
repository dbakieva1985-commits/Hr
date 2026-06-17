const nodemailer = require("nodemailer");

const STATUS_LABELS = {
  SENT:     "Отправлена",
  REVIEW:   "На проверке",
  ASSIGNED: "Назначен исполнитель",
  INWORK:   "В работе",
  DONE:     "Выполнено",
  CLOSED:   "Закрыто",
};

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendStatusEmail(user, request, status) {
  if (!process.env.SMTP_HOST) return; // email не настроен — пропустить

  const label = STATUS_LABELS[status] || status;
  await transporter.sendMail({
    from:    `"HR Service Portal" <${process.env.SMTP_USER}>`,
    to:      user.email,
    subject: `Заявка ${request.number}: статус изменён на «${label}»`,
    html: `
      <p>Здравствуйте, ${user.fullName}!</p>
      <p>Статус вашей заявки <b>${request.number} — ${request.service?.title || ""}</b>
         изменён на <b>${label}</b>.</p>
      <p>Отслеживайте прогресс на портале HR Service Portal.</p>
    `,
  });
}

module.exports = { sendStatusEmail };

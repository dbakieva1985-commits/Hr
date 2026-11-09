// Настройки Firebase проекта family-budget-a92be (это не пароль, их можно хранить в коде)
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBG0AT-UwKxaBJ5XJfCikNmcikBTOVQXK8",
  authDomain: "family-budget-a92be.firebaseapp.com",
  projectId: "family-budget-a92be",
  storageBucket: "family-budget-a92be.firebasestorage.app",
  messagingSenderId: "662840017279",
  appId: "1:662840017279:web:75165fd0d361af08895a4a"
};

// Стартовые постоянные платежи — записываются один раз, если база пустая
window.SEED = [
  { id: "in01",  kind: "income", title: "Поступление 1-го числа", amount: 120000, day: 1,  category: "Поступления" },
  { id: "in05a", kind: "income", title: "Поступление 5-го числа", amount: 120000, day: 5,  category: "Поступления" },
  { id: "in05b", kind: "income", title: "Поступление 5-го числа (30 тыс)", amount: 30000, day: 5, category: "Поступления" },
  { id: "in11",  kind: "income", title: "Поступление 11-го числа", amount: 120000, day: 11, category: "Поступления" },
  { id: "in25a", kind: "income", title: "Дарабоз", amount: 200000, day: 25, category: "Поступления" },
  { id: "in25b", kind: "income", title: "Москва",  amount: 350000, day: 25, category: "Поступления" },
  { id: "in25c", kind: "income", title: "Поступление 25-го числа", amount: 120000, day: 25, category: "Поступления" },
  { id: "in27",  kind: "income", title: "3 мкр", amount: 200000, day: 27, category: "Поступления" },
  { id: "in28",  kind: "income", title: "8 мкр", amount: 200000, day: 28, category: "Поступления" },

  { id: "ex-madika",   kind: "expense", title: "Мадика", amount: 74000, day: 5, dayNote: "с 1 по 5 число", category: "Дети" },
  { id: "ex-driver",   kind: "expense", title: "Водитель", amount: 30000, day: 2, category: "Транспорт" },
  { id: "ex-mortgage", kind: "expense", title: "Ипотека", amount: 320000, day: 25, dayNote: "с 23 по 25 число", category: "Ипотека" },
  { id: "ex-house",    kind: "expense", title: "За дом", amount: null, day: 25, dayNote: "до 25 числа", category: "Дом",
    seasonal: { summer: 40000, winter: 60000, winterMonths: [10, 11, 12, 1, 2, 3, 4] } },
  { id: "ex-internet", kind: "expense", title: "Интернет", amount: 7000, day: null, category: "Связь" },
  { id: "ex-lunch",    kind: "expense", title: "Обеды Мадику", amount: 20000, day: null, category: "Дети" },
  { id: "ex-haircut",  kind: "expense", title: "Стрижка Мади", amount: 5000, day: null, category: "Дети" },
  { id: "ex-fuel",     kind: "expense", title: "Бензин (жена)", amount: 27000, day: null,
    dayNote: "9 000 раз в полторы недели, ~3 заправки", category: "Транспорт", payer: "Жена" },
  { id: "ex-fuel-husband", kind: "expense", title: "Бензин (муж)", amount: 23000, day: null, category: "Транспорт", payer: "Муж" },
  { id: "ex-groceries", kind: "expense", title: "Продукты по списку", amount: 0, weekly: { weekday: 5 }, day: null,
    dayNote: "список от жены", category: "Продукты", payer: "Муж" }
];

// Разовые траты, перенесённые из первой версии
window.SEED_ENTRIES = [
  { id: "6un4zlrh64h7t74myejn", month: "2026-11", kind: "expense", amount: 15000, title: "Торт, сладкое",
    category: "Продукты", date: "2026-11-08", by: "Жена", createdAt: 1794135592916 }
];

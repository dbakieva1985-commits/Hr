// The menu of the weekend 31 Oct – 1 Nov 2026, from Firuza's notes.
// Ingredients are exactly what was bought; dishes nothing was bought for stay without ingredients
// (they show up as reminders to fill in).
export const LAST_MENU = {
  id: 'weekend-2026-10-31',
  sat_date: '2026-10-31',
  status: 'closed',
  dishes: [
    {
      name: 'Борщ',
      category: 'суп',
      ingredients: [
        { name: 'Свекла', qty: 2, unit: 'шт' },
        { name: 'Морковь', qty: 2, unit: 'шт' },
        { name: 'Капуста', qty: 1, unit: 'шт', note: 'маленькая' },
      ],
    },
    {
      name: 'Суп',
      category: 'суп',
      note: 'Всё для супа: копчёности, маслины, лимон.',
      ingredients: [
        { name: 'Копчёная грудка', qty: 2, unit: 'шт' },
        { name: 'Копчёности', qty: null, unit: 'шт', note: 'ассорти' },
        { name: 'Маслины', qty: 1, unit: 'банка' },
        { name: 'Лимон', qty: 1, unit: 'шт' },
      ],
    },
    {
      name: 'Перчики',
      category: 'горячее',
      ingredients: [{ name: 'Перец болгарский', qty: 1, unit: 'пакет', note: 'полный пакет' }],
    },
    {
      name: 'Салат Мадика',
      category: 'салат',
      ingredients: [{ name: 'Копчёная грудка', qty: 2, unit: 'шт' }],
    },
    { name: 'Курица запечённая', category: 'горячее' },
    { name: 'Стейк с сыром и помидором', category: 'горячее' },
    {
      name: 'Пюре',
      category: 'гарнир',
      ingredients: [{ name: 'Картофель', qty: 5, unit: 'кг' }],
    },
  ],
  // Bought that weekend but not tied to a particular dish.
  extras: [
    { name: 'Гранат', amount: '1 шт' },
    { name: 'Огурцы', amount: '1 кг' },
  ],
};

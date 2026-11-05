import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db.js';
import { buildShoppingList } from './lib/shopping.js';

export const toMap = (arr) => new Map((arr ?? []).map((x) => [x.id, x]));

export function usePlan(planId) {
  return useLiveQuery(() => (planId ? db.weekPlans.get(planId) : undefined), [planId]);
}

export function usePlanItems(planId) {
  return useLiveQuery(
    async () => (planId ? (await db.planItems.where('plan_id').equals(planId).toArray()).sort((a, b) => a.order - b.order) : []),
    [planId],
    [],
  );
}

export const useDishes = () => useLiveQuery(() => db.dishes.toArray(), [], []);
export const useProducts = () => useLiveQuery(() => db.products.toArray(), [], []);
export const useIngredients = () => useLiveQuery(() => db.dishIngredients.toArray(), [], []);

export function useShoppingList(planId) {
  return useLiveQuery(async () => {
    if (!planId) return { missing: [], lines: [] };
    const [planItems, dishes, ingredients, products, overrides] = await Promise.all([
      db.planItems.where('plan_id').equals(planId).toArray(),
      db.dishes.toArray(),
      db.dishIngredients.toArray(),
      db.products.toArray(),
      db.shoppingOverrides.where('plan_id').equals(planId).toArray(),
    ]);
    return buildShoppingList({ planItems, dishes: toMap(dishes), ingredients, products: toMap(products), overrides });
  }, [planId], { missing: [], lines: [] });
}

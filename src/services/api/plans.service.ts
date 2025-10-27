import { apiClient } from './base';
import { API_ENDPOINTS, API_ERROR_MESSAGES } from '../../constants/api';
import { Plan } from '../../types';

interface PlansResponse {
  list: Plan[];
}

export const plansService = {

  async fetchPlans(): Promise<Plan[]> {
    try {
      const data = await apiClient.get<PlansResponse>(API_ENDPOINTS.PLANS);
      return data.list || [];
    } catch (error) {
      throw new Error(API_ERROR_MESSAGES.PLANS_FETCH_ERROR);
    }
  },


  filterPlansByAge(plans: Plan[], userAge: number): Plan[] {
    return plans.filter(plan => userAge <= plan.age);
  },


  calculateDiscountedPrice(originalPrice: number, isForSomeoneElse: boolean): number {
    if (isForSomeoneElse) {
      return originalPrice * 0.95;
    }
    return originalPrice;
  },
};

import { apiClient } from './base';
import { API_ENDPOINTS, API_ERROR_MESSAGES } from '../../constants/api';
import { UserAPIData } from '../../types';

export const userService = {
  async fetchUserData(): Promise<UserAPIData> {
    try {
      const data = await apiClient.get<UserAPIData>(API_ENDPOINTS.USER);
      return data;
    } catch (error) {
      throw new Error(API_ERROR_MESSAGES.USER_FETCH_ERROR);
    }
  },
};

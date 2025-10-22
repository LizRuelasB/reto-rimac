import { UserAPIData, Plan } from '../types';

const BASE_URL = 'https://rimac-front-end-challenge.netlify.app/api';

export const getUserData = async (): Promise<UserAPIData> => {
  try {
    const response = await fetch(`${BASE_URL}/user.json`); 
    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }
    const data: UserAPIData = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getUserData:', error);
    throw new Error('Fallo en la comunicación con el API de usuario.');
  }
};

export const getPlans = async (): Promise<Plan[]> => {
  try {
    const response = await fetch(`${BASE_URL}/plans.json`);
    if (!response.ok) {
      throw new Error('Error al obtener los planes');
    }
    const data: { list: Plan[] } = await response.json();
    return data.list;
  } catch (error) {
    console.error('Error en getPlans:', error);
    throw new Error('Fallo en la comunicación con el API de planes.');
  }
};
import api from '@/services/api';

export const loginRequest = async (email: string, password: string) => {
  return await api.auth.login(email, password);
};
export const registerRequest = async (
  name: string,
  email: string,
  password: string
) => {
  return await api.auth.register(name, email, password);
};

import api from "./axios";

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post("/Auth/login", {
    email,
    password,
  });

  return res.data;
};
export const registerRequest = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/Auth/register", {
    name,
    email,
    password,
  });

  return res.data;
};
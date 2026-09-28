import http from "./http";

const signup = async (data) => {
  const response = await http.post("/auth/signup", data);

  return response.data;
};

const login = async (data) => {
  const response = await http.post("/auth/login", data);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await http.post("/auth/forgot-password", { email });
  return response.data;
};

const resetPassword = async (token, password) => {
  const response = await http.post("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};

const googleAuth = async (credential) => {
  const response = await http.post("/auth/google", { credential });

  return response.data;
};

const logout = async () => {
  const response = await http.post("/auth/logout");

  return response.data;
};

const authService = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  googleAuth,
  logout,
};

export default authService;

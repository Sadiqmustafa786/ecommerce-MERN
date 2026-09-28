import http from "./http";

const verifySession = async (sessionId) => {
  const response = await http.get("/payment/verify-session", {
    params: { sessionId },
  });

  return response.data;
};

const paymentService = {
  verifySession,
};

export default paymentService;

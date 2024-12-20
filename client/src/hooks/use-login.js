import { useState } from "react";
import axios from "axios";

const client = axios.create({
  baseURL: "https://zbn7r948-3001.inc1.devtunnels.ms/api/v1",
});

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await client.post("/auth/login", { email, password });

      const token = res?.data?.token;
      console.log("res", token, res);
      localStorage.setItem("token", token);
      window.location.assign("/");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      console.error("Login error:", err.response);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

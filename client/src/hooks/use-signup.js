import { useState } from "react";
import axios from "axios";

const client = axios.create({
  baseURL: "https://zbn7r948-3001.inc1.devtunnels.ms/api/v1",
});

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (email, username, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await client.post("/auth/signup", {
        email,
        username,
        password,
      });

      console.log("Sign up success:", res);
      const token = res?.data?.token;
      console.log("res", token, res);
      localStorage.setItem("token", token);

      window.location.assign(window.location.href);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      console.error("Sign up error:", err.response);
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
};

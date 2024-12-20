import React, { useState } from "react";
import GoogleAuth from "./GoogleAuth";
import { useLogin } from "hooks/use-login";
import SignUp from "./SignUp";

const SignIn = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password); // Call the hook's login function
  };
  return (
    <div style={{ padding: "16px 20px" }}>
      <p>Sign in to like videos, comment, and subscribe.</p>
      <br />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <GoogleAuth />
        <button style={{ width: "100%", padding: 9 }} onClick={openDialog}>
          Login with Email
        </button>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: "black" }}>Login</h3>

            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "none",
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "black",
              }}
              onClick={closeDialog}
              aria-label="Close"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ color: "black" }}>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    margin: "10px 0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    color: "black",
                  }}
                />
              </div>
              <div>
                <label style={{ color: "black" }}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    margin: "10px 0",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    color: "black",
                  }}
                />
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <SignUp />
              </div>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;

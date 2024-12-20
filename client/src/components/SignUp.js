import { useSignUp } from "hooks/use-signup";
import React, { useState } from "react";

const SignUp = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, loading, error } = useSignUp();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp(email, username, password);
  };

  return (
    <div style={{ padding: "16px 20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            color: "black",
            cursor: "pointer",
          }}
          onClick={openDialog}
        >
          Don't have an account? Sign Up
        </div>
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
            <h3 style={{ marginBottom: "20px", color: "black" }}>Sign Up</h3>

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
              <div style={{ marginBottom: "5px" }}>
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
              <div style={{ marginBottom: "5px" }}>
                <label style={{ color: "black" }}>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                {loading ? "Signing up..." : "Sign Up"}
              </button>
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

export default SignUp;

import React, { useState } from "react";

const API_SIGNUP_URL = "https://gru71b3834.execute-api.us-east-1.amazonaws.com/userauthAPIdeployment";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Sign up failed");
      }

      setSuccessMsg("Sign-up successful! Please check your email to confirm.");
      setError(null);
    } catch (error) {
      console.error("Sign-up error:", error);
      setError(error.message);
      setSuccessMsg(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
        required
      />
      <input
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </form>
  );
}

export default SignUp;

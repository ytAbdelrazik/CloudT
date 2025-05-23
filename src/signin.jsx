import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import{Amplify} from "aws-amplify";
import { Auth } from "./aws-config";
Amplify.configure({
  Auth: {
    region: 'us-east-1', // 🔁 your AWS region
    userPoolId: 'us-east-1_Ab12Cd34E', // 🔁 your Cognito User Pool ID
    userPoolWebClientId: '7n3v5s7k9q2g5r6t1v2b3d4f5g', // 🔁 your App Client ID
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
});
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setError(null);

      const user = await Auth.signIn(email, password);
      console.log("User signed in:", user);

      // Get the JWT token
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      const accessToken = session.getAccessToken().getJwtToken();

      // Store tokens in localStorage (or cookies, depending on your needs)
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);

      navigate("/dashboard");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.message || "Sign in failed");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <br />
      <button onClick={handleSignIn}>Sign In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SignIn;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupService } from "../../services/auth.services";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerification, setPasswordVerification] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlePasswordChangeVerification = (e) =>
    setPasswordVerification(e.target.value);

  const handleSingup = async (e) => {
    e.preventDefault();

    if (password !== passwordVerification) {
      return setErrorMessage("No coinciden las contraseñas");
    }

    try {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      await signupService(user);
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
      console.log(error.response);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        //navigate("/error");
        console.log(error);
      }
    }
  };

  return (
    <div className="login-box">
      <pre>
        <h2>Signup</h2>
      </pre>
      <form onSubmit={handleSingup}>
        <div class="user-box">
          <input type="text" value={username} onChange={handleUsernameChange} />
          <label>Nombre de usuario</label>
        </div>

        <br />
        <div class="user-box">
          <input type="email" value={email} onChange={handleEmailChange} />
          <label>Email</label>
        </div>

        <br />

        <div class="user-box">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <label>Contraseña</label>
        </div>

        <br />

        <div class="user-box">
          <input
            type="password"
            value={passwordVerification}
            onChange={handlePasswordChangeVerification}
          />
          <label>Repite la Contraseña</label>
        </div>

        <br />

        <button type="submit">Sign Up</button>
        <pre>
          {errorMessage && <p style={{ color: "#03e9f4" }}>{errorMessage}</p>}
        </pre>
      </form>
    </div>
  );
}

export default Signup;

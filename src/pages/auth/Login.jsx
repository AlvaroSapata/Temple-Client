import { useContext, useState } from "react";
import { useActionData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { loginService } from "../../services/auth.services";

function Login() {
  const { authenticateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //1 token con las credentials
      const response = await loginService({
        email: email,
        password: password,
      });
      //guardamos el token en el local storage
      localStorage.setItem("authToken", response.data.authToken);

      await authenticateUser();

      //3. redireccionamos a la pantalla privada para solo usuarios
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        navigate("/");
      }
    }
  };
  return (
    <div>
      <h1>Log In</h1>

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
        />

        <br />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          />


          <br />
          <button type="submit">Log In</button>
          <br />
          {errorMessage && <p style={{ color: "red" }} >{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Login;

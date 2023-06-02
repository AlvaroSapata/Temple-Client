import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupService } from "../../services/auth.services";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSingup = async (e) => {
    e.preventDefault();

    try {
      const user = {
        username: username,
        email: email,
        password: password,
      };

      await signupService(user);
      navigate("/auth/login");
    } catch (error) {
      console.log(error)
      console.log(error.response);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        //navigate("/error");
        console.log(error)
      }
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSingup}>
        <label>Username</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
       
       <br/>
       
        <label>Email</label>
        <input type="email" value={email} onChange={handleEmailChange} />
        
        <br />
        
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />


        <br />
        
        <button type="submit">Sign Up</button>
        
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Signup;

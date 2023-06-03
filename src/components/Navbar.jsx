import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const navigate = useNavigate();

  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  const handleLogout = () => {
    // 1. Borrar el token
    localStorage.removeItem("authToken");

    // 2. validar contra el BE que el token fue borrado
    authenticateUser();

    // 3. Redirigir
    navigate("/");
  };

  return (
    <div style={{ margin: "20px" }}>
      <Link to="/">Home</Link>
      
      {!isLoggedIn ? <Link to="/auth/signup">Registro</Link> : null}
      {!isLoggedIn ? <Link to="/auth/login">Iniciar Sesión</Link> : null}

      <Link to="/djs">Nuestros Djs</Link>

      <Link to="/events">Events</Link>

      <Link to="/locations">Locations</Link>

      <Link to="/products">Productos</Link>
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
}

export default Navbar;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function SecNavbar({ toggleNavbar }) {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="mySecNavbar">
      <div className="mySecNavbarTop">
        <Link to="/" onClick={toggleNavbar} className="myHomeNav">
          Inicio
        </Link>
      </div>
      <div className="mySecNavbarList">
        {!isLoggedIn ? (
          <Link to="/auth/signup" onClick={toggleNavbar}>
            <div className="eachName">Registro</div>
          </Link>
        ) : null}
        {!isLoggedIn ? (
          <Link to="/auth/login" onClick={toggleNavbar}>
            <div className="eachName">Iniciar Sesión</div>
          </Link>
        ) : null}

        <Link to="/djs" onClick={toggleNavbar}>
          <div className="eachName">Nuestros Djs</div>
        </Link>

        <Link to="/events" onClick={toggleNavbar}>
          <div className="eachName">Eventos</div>
        </Link>

        <Link to="/locations" onClick={toggleNavbar}>
          <div className="eachName">Ubicaciones</div>
        </Link>

        <Link to="/products" onClick={toggleNavbar}>
          <div className="eachName">Productos</div>
        </Link>
      </div>
    </div>
  );
}

export default SecNavbar;

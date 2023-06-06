import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

import SecNavbar from "./SecNavbar";

function Navbar() {
  // Estado visivilidad barra navegacion
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  // Muestra/esconde la barra de navegacion
  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  const handleLogout = () => {
    // 1. Borrar el token
    localStorage.removeItem("authToken");

    // 2. validar contra el BE que el token fue borrado
    authenticateUser();

    // 3. Redirigir
    navigate("/");
  };

  return (
    <div className="myNavbar">
      <Link to="/" className="myHomeNav">
        Inicio
      </Link>
      <div className="iconContainer">
      <img
        onClick={toggleNavbar}
        className="myDesplegable"
        src="images/image (3).png"
        alt="asd"
      />
      </div>
      <a
        href="https://www.instagram.com/templewav/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="myInsta"
          src="/images/icons8-instagram-48.png"
          alt="asd"
        />
      </a>
      {isLoggedIn ? (
        <img
          onClick={handleLogout}
          className="myLogout"
          src="/images/icons8-logout-50.png"
          alt="asd"
        />
      ) : null}

      {isNavbarVisible ? <SecNavbar toggleNavbar={toggleNavbar} /> : null}
    </div>
  );
}

export default Navbar;

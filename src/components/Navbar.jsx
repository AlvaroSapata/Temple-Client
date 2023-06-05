import { useState } from "react";
import { Link } from "react-router-dom";

import SecNavbar from "./SecNavbar";

function Navbar() {
  // Estado visivilidad barra navegacion
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  // Muestra/esconde la barra de navegacion
  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  return (
    <div className="myNavbar">
      <Link to="/" className="myHomeNav">Inicio</Link>

      

      <img onClick={toggleNavbar} className="myDesplegable" src="images/image (3).png" alt="asd" />
      {isNavbarVisible ? <SecNavbar toggleNavbar={toggleNavbar}/> : null}
    </div>
  );
}

export default Navbar;

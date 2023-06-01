import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div style={{margin:"20px"}}>
    
    <Link to="/">Home</Link>

    <Link to="/auth/signup">Registro</Link>
    <Link to="/auth/login">Login</Link>

    <Link to="/djs">Nuestros Djs</Link>

    <Link to="/events">Events</Link>

    <Link to="/locations">Locations</Link>

    <Link to="/products">Productos</Link>
    
    </div>
  )
}

export default Navbar
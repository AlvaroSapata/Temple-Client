import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div style={{margin:"20px"}}>
    
    <Link to="/">Home</Link>

    <Link to="/auth/signup">Registro</Link>
    <Link to="/auth/login">Login</Link>

    <Link to="/api/djs">Nuestros Djs</Link>

    <Link to="/api/events">Events</Link>

    <Link to="/api/locations">Locations</Link>

    <Link to="/api/products">Productos</Link>
    
    </div>
  )
}

export default Navbar
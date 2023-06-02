import './App.css';
import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom';
// Home
import Home from "./pages/Home";
// Auth
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
// Errors
import Error from "./pages/errors/Error";
import NotFound from "./pages/errors/NotFound";
// Djs
import Djs from "./pages/djs/Djs";
// Events
import Events from "./pages/events/Events";
// Locations
import Locations from "./pages/locations/Locations";
import LocationDetails from "./pages/locations/LocationDetails";
// Products
import Products from "./pages/products/Products";

function App() {
  return (
    <div className="App">
      <Navbar/>

      <Routes>

        <Route path='/' element= {<Home/>}/>
        <Route path='/auth/signup' element= {<Signup/>}/>
        <Route path="/auth/login" element={<Login />} />

        <Route path='/djs' element= {<Djs/>}/>

        <Route path="/events" element={<Events />} />

        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:locationId" element={<LocationDetails />} />

        <Route path="/products" element={<Products />} />

        <Route path="/error" element={<Error />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      

    </div>
  );
}



export default App;

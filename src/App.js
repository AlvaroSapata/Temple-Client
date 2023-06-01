import './App.css';
import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Error from "./pages/errors/Error";
import NotFound from "./pages/errors/NotFound";

function App() {
  return (
    <div className="App">
      <Navbar/>

      <Routes>

        <Route path='/' element= {<Home/>}/>
        <Route path='/auth/signup' element= {<Signup/>}/>
        <Route path="/auth/login" element={<Login />} />

        <Route path="/error" element={<Error />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      

    </div>
  );
}



export default App;

import { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddDjForm from "../../components/djs/AddDjForm";
import { deleteDjService, getAllDjsService } from "../../services/djs.services";
import ScaleLoader from "react-spinners/ScaleLoader";
import { AuthContext } from "../../context/auth.context.js";
import Card from 'react-bootstrap/Card';

function Djs() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
    // Destructuracion
    const { isAdmin } = useContext(AuthContext);
  // Estado principal
  const [djs, setDjs] = useState([]);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []); // CDM

  // Actualizamos los estados
  const getData = async () => {
    try {
      const response = await getAllDjsService()
      // console.log(response);
      setDjs(response.data);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
  };

  // Elimina un DJ por su ID
  const deleteDj = async (id) => {
    try {
      await deleteDjService(id);
      // Actualizamos los datos después de la eliminación
      getData();
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
  };

  // Muestra/esconde el formulario
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Clausula de loading
  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div>
      <h3>Nuestros Djs</h3>
      {isAdmin?<button className="myButtons" onClick={toggleForm}>Añadir Dj</button>:null}
      
      {isFormVisible ? (
        <AddDjForm
          getData={getData}
          setIsLoading={setIsLoading}
          toggleForm={toggleForm}
        />
      ) : null}
      {djs.map((eachDj) => {
        return (
          <div key={eachDj._id}>
            <img src={eachDj.image} alt="eachDj" width={"250px"} />
            <p>{eachDj.name}</p>
            {/* Utilizamos una funcion anonima para pasar el id a la funcion delete */}
            {isAdmin?<button className="myButtons" onClick={() => deleteDj(eachDj._id)}>eliminar</button>:null}
            
          </div>
        );
      })}
    </div>
  );
}

export default Djs;

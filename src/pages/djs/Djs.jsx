import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddDjForm from "../../components/djs/AddDjForm";
import { deleteDjService } from "../../services/djs.services";

function Djs() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
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
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/djs`
      );
      console.log(response);
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
    return <h3>Cargando...</h3>;
  }

  return (
    <div>
      <h3>Nuestros Djs</h3>
      <button className="myButtons" onClick={toggleForm}>Añadir Dj</button> {/* Solo Admin */}
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
            <button className="myButtons" onClick={() => deleteDj(eachDj._id)}>eliminar</button>
          </div>
        );
      })}
    </div>
  );
}

export default Djs;

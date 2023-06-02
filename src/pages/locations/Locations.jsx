import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {deleteLocationService} from "../../services/locations.services";
import AddLocationForm from "../../components/locations/AddLocationForm";
function Locations() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
  // Estado principal
  const [locations, setLocations] = useState([]);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);
  // Estado para editar la ubicacion
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getData();
  }, []); // CDM

  // Actualizamos los estados
  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/locations`
      );
      console.log(response);
      setLocations(response.data);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
  };

  // Elimina una ubicacion por su ID
  const deleteProduct = async (id) => {
    try {
      await deleteLocationService(id);
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
      <h3>Nuestros Locales</h3>
      <button onClick={toggleForm}>Añadir Ubicacion</button> {/* Solo Admin */}
      

      {isFormVisible ? (
        <AddLocationForm
          getData={getData}
          setIsLoading={setIsLoading}
          toggleForm={toggleForm}
        />
      ) : null}

      {locations.map((eachLocation) => {
        return (
          <div key={eachLocation._id} className="locationContainer">
          <Link to={`/locations/${eachLocation._id}`}>
          <p>{eachLocation.name}</p>
          <img src={eachLocation.image} alt="imagen" width={"300px"}/>
          <p>{eachLocation.description}</p>
          </Link>
          <button onClick={() => deleteProduct(eachLocation._id)}>
              eliminar
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Locations
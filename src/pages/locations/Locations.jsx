import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLocationService,
  getAllLocationsService,
} from "../../services/locations.services";
import AddLocationForm from "../../components/locations/AddLocationForm";
import ScaleLoader from "react-spinners/ScaleLoader";

import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

function Locations() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
  // Estado principal
  const [locations, setLocations] = useState([]);
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
      const response = await getAllLocationsService();
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
    return <ScaleLoader color="#36d7b7" className="myLoader" />;
  }

  return (
    <div className="locationsListPage">
      <h3>Nuestros Locales</h3>
      <button className="myButtons" onClick={toggleForm}>
        Añadir Ubicacion
      </button>{" "}
      {/* Solo Admin */}
      {isFormVisible ? (
        <AddLocationForm
          getData={getData}
          setIsLoading={setIsLoading}
          toggleForm={toggleForm}
        />
      ) : null}
      <div className="myLocationsList">
      {locations.map((eachLocation) => {
        return (
          <div key={eachLocation._id} >
            <Link to={`/locations/${eachLocation._id}`}>
              <Card className="myCardStyle">
                <Card.Img variant="top" src={eachLocation.image} />
                <Card.Body>
                  <Card.Title>{eachLocation.name}</Card.Title>
                  <Card.Text>{eachLocation.description}</Card.Text>
                  <Button className="myButtons" style={{backgroundColor:"lightRed"}}
                    variant="danger"
                    onClick={() => deleteProduct(eachLocation._id)}
                  >
                    Eliminar
                  </Button>
                </Card.Body>
              </Card>
            </Link>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default Locations;

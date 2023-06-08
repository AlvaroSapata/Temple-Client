import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteLocationService,
  getAllLocationsService,
} from "../../services/locations.services";
import AddLocationForm from "../../components/locations/AddLocationForm";
import ScaleLoader from "react-spinners/ScaleLoader";

import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../context/auth.context.js";
function Locations() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
  // Destructuracion
  const { isAdmin } = useContext(AuthContext);
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
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div className="locationsListPage">
      {isAdmin ? (
        <button className="myButtons" onClick={toggleForm}>
          Añadir Ubicacion
        </button>
      ) : null}

      <h3>Nuestros Locales</h3>
      {/* Solo Admin */}
      {isFormVisible ? (
        <AddLocationForm
          getData={getData}
          setIsLoading={setIsLoading}
          toggleForm={toggleForm}
        />
      ) : null}
      {/* Cartas */}
      <div className="myLocationsList">
        {locations.map((eachLocation) => {
          return (
            <div key={eachLocation._id}>
              <Link to={`/locations/${eachLocation._id}`}>
                <div>
                  <div className="mycardIG">
                    <div className="myimageIG">
                      <img src={eachLocation.image} alt="eachImg" />
                    </div>
                    <div className="mytextIG">
                      <div className="mymainIG">
                        <span>{eachLocation.name}</span>
                      </div>
                      <div className="mysubIG">
                        <span>
                          <img
                            className="locationImgfix"
                            src="images/icons8-location-50.png"
                            alt="eachImg"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="mydateIG">
                      <span>{eachLocation.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Locations;

{
  /*              <Card className="myLocationCardStyle">
                  <div className="myLocationsListImgContainer">
                    <Card.Img variant="top" src={eachLocation.image} />
                  </div>
                  <Card.Body>
                    <Card.Title>{eachLocation.name}</Card.Title>
                    <Card.Text>{eachLocation.description}</Card.Text>
                  </Card.Body>
                </Card> */
}

import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteLocationService,
  getLocationDetailsService,
} from "../../services/locations.services";
import EditLocationForm from "./EditLocationForm";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../context/auth.context.js";

function LocationDetails() {
  const params = useParams();
  // console.log(params);
  // Destructuracion
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [locationDetails, setLocationDetails] = useState(null);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getLocationDetailsService(params.locationId);

      // console.log(response);
      setLocationDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLocationService(params.locationId);
      navigate("/locations");
    } catch (error) {
      console.log(error);
    }
  };

  // Muestra/esconde el formulario
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  if (isLoading) {
    return <h3>...buscando</h3>;
  }

  return (
    <div className="locationsDetailsPage">
      <h3>Detalles de la Ubicacion</h3>
      <div>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src={locationDetails.image} />
          <Card.Body>
            <Card.Title>{locationDetails.name}</Card.Title>
            <Card.Text>{locationDetails.description}</Card.Text>
            {isAdmin ? (
              <Button variant="primary" onClick={handleDelete}>
                eliminar
              </Button>
            ) : null}
            {isAdmin ? (
              <Button variant="primary" onClick={toggleForm}>
                editar
              </Button>
            ) : null}
          </Card.Body>
        </Card>
      </div>

      {isFormVisible ? (
        <EditLocationForm locationDetails={locationDetails} getData={getData} />
      ) : null}
    </div>
  );
}

export default LocationDetails;

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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ScaleLoader from "react-spinners/ScaleLoader";
function LocationDetails() {
  const params = useParams();

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
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div className="locationsDetailsPage">
      <div className="separadorbtns">
        {isAdmin ? (
          <Button
            className="myButtons"
            variant="primary"
            onClick={handleDelete}
          >
            eliminar
          </Button>
        ) : null}
        {isAdmin ? (
          <Button className="myButtons" variant="primary" onClick={toggleForm}>
            editar
          </Button>
        ) : null}
      </div>
      <div>
        <Card className="myLocationCard">
          <div className="divIzd">
            <Card.Body>
              <Card.Img variant="top" src={locationDetails.image} />
            </Card.Body>
          </div>
          <div className="divDcha">
            <Card.Body>
              <Card.Title className="tituloLocation">
                {locationDetails.name}
              </Card.Title>
              <Card.Text className="descripcionLocation">
                {locationDetails.description}
              </Card.Text>
              <div className="contendorMapa">
                <MapContainer
                  className="mapLocationShow"
                  center={locationDetails.address}
                  zoom={17}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={locationDetails.address}>
                    <Popup>
                      <b>{locationDetails.name}</b>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card.Body>
          </div>
        </Card>
      </div>

      {isFormVisible ? (
        <EditLocationForm locationDetails={locationDetails} getData={getData} />
      ) : null}
    </div>
  );
}

export default LocationDetails;

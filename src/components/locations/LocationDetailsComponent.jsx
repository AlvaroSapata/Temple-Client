import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteLocationService,
  getAllLocationsService,
  editLocationService,
  getLocationDetailsService,
} from "../../services/locations.services";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function LocationDetails() {
  const params = useParams();
  console.log(params);
  const navigate = useNavigate();

  const [locationDetails, setLocationDetails] = useState(null);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);
  // Leaflet mapa
  // const [ center, setCenter ] = useState([42.34, -3.71])

  // const [clickedPosition, setClickedPosition] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getLocationDetailsService(params.locationId);

      console.log(response);
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
  if (isLoading) {
    return <h3>...buscando</h3>;
  }

  return (
    <div>
      <h3>Detalles de la Ubicacion</h3>
      <div>
        <p>{locationDetails.name}</p>
        <p>{locationDetails.description}</p>
        <img src={locationDetails.image} alt="imagen" width={"200px"} />
      </div>
      {/*     <MapContainer center={center} zoom={18} scrollWheelZoom={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

</MapContainer> */}
      <button onClick={handleDelete}>eliminar</button>
    </div>
  );
}

export default LocationDetails;

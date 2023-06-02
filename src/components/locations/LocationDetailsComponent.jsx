import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteLocationService,
  getLocationDetailsService,
} from "../../services/locations.services";
import EditLocationForm from "./EditLocationForm";

function LocationDetails() {
  const params = useParams();
  console.log(params);
  const navigate = useNavigate();

  const [locationDetails, setLocationDetails] = useState(null);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);

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
      <button onClick={handleDelete}>eliminar</button>
      <button >editar</button>
      <EditLocationForm locationDetails={locationDetails} getData={getData}/>

    </div>
  );
}

export default LocationDetails;

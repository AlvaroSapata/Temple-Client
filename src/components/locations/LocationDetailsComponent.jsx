import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteLocationService,
  getAllLocationsService,
  editLocationService,
  getLocationDetailsService
} from "../../services/locations.services";

function LocationDetails() {
  const params = useParams();
  const navigate = useNavigate();

  const [locationDetails, setLocationDetails] = useState(null);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    getData()
  },[])

  const getData = async () => {
    try {
    const response = await getLocationDetailsService(params.id);

    console.log(response);

    }
    catch (error) {
      console.log(error);
    }
  }

  return <div>LocationDetails COmponent</div>;
}

export default LocationDetails;

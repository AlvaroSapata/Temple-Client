import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteEventsService,
  getEventsDetailsService,
} from "../../services/events.services";
import EditEvent from "./EditEvents";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../../services/locations.services";
import { getAllDjsService } from "../../services/djs.services";
import { AuthContext } from "../../context/auth.context.js";

function EventDetailsComponents(props) {
  // Destructuracion
  const { isAdmin } = useContext(AuthContext);
  const params = useParams();

  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState(null);

  const [allLocations, setAllLocations] = useState([]);

  const [allDjs, setAllDjs] = useState([]);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getEventsDetailsService(params.eventsId);
      response.data.date = new Date(response.data.date).toLocaleDateString();

      setEventDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
    console.log(eventDetails);
    try {
      const response = await getAllLocationsService();

      setAllLocations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await getAllDjsService();

      setAllDjs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventsService(params.eventsId);
      navigate("/events");
    } catch (error) {
      console.log(error);
    }
  };

  // Muestra/esconde el formulario
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  if (isLoading) {
    return <ScaleLoader color="#36d7b7" className="myLoader" />;
  }

  return (
    <div className="eventDetailsPage">
      <h3>Detalles del Evento</h3>
      {isAdmin ? (
        <button className="myButtons" onClick={handleDelete}>
          eliminar
        </button>
      ) : null}
      {isAdmin ? (
        <button className="myButtons" onClick={toggleForm}>
        editar
      </button>
      ) : null}
      
      {isFormVisible ? (
        <EditEvent
          eventDetails={eventDetails}
          getData={getData}
          djsArr={allDjs}
          locationsArr={allLocations}
        />
      ) : null}

      <div>
        <p>{eventDetails.title}</p>
        <p>{eventDetails.date}</p>
        <img src={eventDetails.image} alt="imagen" width={"200px"} />
        <p>{eventDetails.location.title}</p>

        <p>GALERIIIIA</p>
        <p>AFTER MOVIIIIE</p>
        {eventDetails.djs.map((eachDjs) => {
          return <p>{eachDjs.name}</p>;
        })}

        <p>{eventDetails.joinPeople.length}</p>
      </div>
    </div>
  );
}

export default EventDetailsComponents;

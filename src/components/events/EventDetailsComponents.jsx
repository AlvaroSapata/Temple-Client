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
// import ReactPlayer from "react-player";

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

  const [joinPeople, setJoinPeople] = useState(0);

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

  const handlecountPeople = async () => {
    try {
      const response = await getEventsDetailsService(params.eventsId);
      setJoinPeople(response.data.joinPeople+1);
    } catch (error) {
      console.log(error);
    }
  }

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
  console.log("first",eventDetails)
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
        <p>Titulo: {eventDetails.title}</p>
        <p>Fecha: {eventDetails.date}</p>
        <img src={eventDetails.image} alt="imagen" width={"200px"} />
        <p>Ubicacion: {eventDetails.location.name}</p>
        {/* <p>GALERIIIIA</p> */}
        {eventDetails.djs.map((eachDjs) => {
          return (
            <div>
              <p>{eachDjs.name}</p>
              <img src={eachDjs.image} alt="dj" style={{ width: "100px" }} />
            </div>
          );
        })}
        <p>{eventDetails.joinPeople.length}</p>
        <button onChange={handlecountPeople} width="200px" > agregar</button>
        <p>Aftermovie Oficial:</p>
{/*         <ReactPlayer className="reactplayer" url="{eventDetails.aftermovie}" controls={"true"} /> */}
      </div>
    </div>
  );
}

export default EventDetailsComponents;

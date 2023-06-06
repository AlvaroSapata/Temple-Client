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
import {joinService} from "../../services/events.services";
import {unJoinService} from "../../services/events.services";
import ReactPlayer from 'react-player'

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

  const [joinPeople, setJoinPeople] = useState([]);

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getEventsDetailsService(params.eventsId);
      response.data.date = new Date(response.data.date).toLocaleDateString();
       ReactPlayer.canPlay(response.data.aftermovie)
       console.log(ReactPlayer.canPlay(response.data.aftermovie));
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
      if(isJoined === true) {
        const response = await unJoinService(params.eventsId)
        console.log(response, "eliminado");
        setJoinPeople(response.data.joinPeople);
        setIsJoined(false);
      }else{
        const response = await joinService(params.eventsId);
      console.log(response, "añadido");
       setJoinPeople(response.data.joinPeople);
       setIsJoined(true);
       
      }
      getData()
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
        
        {eventDetails.djs.map((eachDjs) => {
          return <p>{eachDjs.name}</p>;
        })}

        <p>{eventDetails.joinPeople.length}</p>

        <button onClick={handlecountPeople} width="200px" >{isJoined ? "eliminar" : "añadir"} </button>
      </div>
    </div>
  );
}

export default EventDetailsComponents;

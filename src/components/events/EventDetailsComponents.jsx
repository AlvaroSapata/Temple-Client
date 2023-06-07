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
import { joinService } from "../../services/events.services";
import { unJoinService } from "../../services/events.services";
import ReactPlayer from "react-player";

function EventDetailsComponents(props) {
  // Destructuracion
  const { isAdmin } = useContext(AuthContext);
  const authContext = useContext(AuthContext);

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
      response.data.date = new Date(response.data.date).toISOString().slice(0,10)
      setEventDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }

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

  const handlecountPeople = async (req, res, next) => {
    try {
      if (eventDetails.joinPeople.includes(authContext.user._id)) {
        await unJoinService(params.eventsId);
      } else {
        await joinService(params.eventsId);
      }
      getData();
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
        <p>Titulo: {eventDetails.title}</p>
        <p>Fecha: {eventDetails.date}</p>
        <img src={eventDetails.image} alt="imagen" width={"200px"} />
        <p>Ubicacion: {eventDetails.location.title}</p>

        <p>Djs:</p>
        {eventDetails.djs.map((eachDjs) => {
          return (
            <div key={eachDjs._id}>
              <img src={eachDjs.image} alt="img" width={"100px"} />
              <p>{eachDjs.name}</p>
            </div>
          );
        })}
        <div>
          <p>{eventDetails.joinPeople.length}</p>
          <img src="/images/grupo-de-chat.png" alt="img" width={"50px"} />
        </div>

        <button onClick={handlecountPeople} width="200px">
          {eventDetails.joinPeople.includes(authContext.user._id)
            ? "eliminar"
            : "añadir"}
        </button>
        {eventDetails.gallery && eventDetails.gallery.length > 0 ? (
          <div className="myGalleryContainer">
            {eventDetails.gallery.map((image, index) => (
              <div className="myEachGallery" key={index}>
              <img
                key={index}
                src={image}
                alt={`imagen-${index}`}
                width={"200px"}
              />
              </div>
            ))}
          </div>
        ) : (
          <p>Proximamente ...</p>
        )}
        {eventDetails.afterMovie ? (
          <div className="myReactPlayerContainer">
            <ReactPlayer
              className="reactplayer"
              url={eventDetails.afterMovie}
              controls={true}
            />
          </div>
        ) : (
          <p>Proximamente ...</p>
        )}
      </div>
    </div>
  );
}

export default EventDetailsComponents;

import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  deleteEventsService,
  getEventsDetailsService,
  joinService,
  unJoinService,
} from "../../services/events.services";
import EditEvent from "./EditEvents";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../../services/locations.services";
import { getAllDjsService } from "../../services/djs.services";
import { AuthContext } from "../../context/auth.context.js";
import ReactPlayer from "react-player";
import Card from "react-bootstrap/Card";

function EventDetailsComponents() {
  const { isAdmin } = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [allDjs, setAllDjs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const eventResponse = await getEventsDetailsService(params.eventsId);
      const event = eventResponse.data;
      event.date = new Date(event.date).toISOString().slice(0, 10);
      setEventDetails(event);

      const locationsResponse = await getAllLocationsService();
      setAllLocations(locationsResponse.data);

      const djsResponse = await getAllDjsService();
      setAllDjs(djsResponse.data);
    } catch (error) {
      console.error(error);
      navigate("/error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountPeople = async () => {
    try {
      if (eventDetails.joinPeople.includes(authContext.user._id)) {
        await unJoinService(params.eventsId);
      } else {
        await joinService(params.eventsId);
      }
      getData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventsService(params.eventsId);
      navigate("/events");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  if (!eventDetails) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="eventDetailsPage">
      <div className="separadorbtns">
        {isAdmin && (
          <>
            <button className="myButtons" onClick={handleDelete}>
              eliminar
            </button>
            <button className="myButtons" onClick={toggleForm}>
              editar
            </button>
          </>
        )}
      </div>
      {isFormVisible && (
        <EditEvent
          eventDetails={eventDetails}
          getData={getData}
          djsArr={allDjs}
          locationsArr={allLocations}
        />
      )}

      <Card className="myDetailsCard">
        <Card.Body className="myFirstDiv">
          <div className="divIzquierda">
            {eventDetails.image && (
              <Card.Img
                className="myCartel"
                src={eventDetails.image}
                alt="imagen"
                width={"200px"}
              />
            )}
          </div>

          <div className="divDerecha">
            <div className="TitulodetallesContainer">
              <Card.Title className="TitulodetallesContainerText">
                {eventDetails.title}
              </Card.Title>
            </div>
            <div className="DatedetallesContainer">
              <Card.Text>{eventDetails.date}</Card.Text>
            </div>
            <div className="LocationdetallesContainer">
              <Card.Img src="/images/icons8-location-50.png" alt="location icon" />
              {eventDetails.location && (
                <Link to={`/locations/${eventDetails.location._id}`}>
                  <Card.Text>{eventDetails.location.name}</Card.Text>
                </Link>
              )}
            </div>
            <div className="djsFix">
              <Link to={`/djs`}>
                <div className="djscontainer">
                  {eventDetails.djs && eventDetails.djs.map((dj) => (
                    <div key={dj._id} className="centraciondjs">
                      <Card.Text>{dj.name}</Card.Text>
                      <div className="djsImagencontenedor">
                        {dj.image && (
                          <Card.Img
                            className="djDetailsImg"
                            src={dj.image}
                            alt="dj"
                            width={"100px"}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            </div>

            <div className="gentequeva">
              <div className="botoncontainer">
                <button
                  className="myButtons"
                  onClick={handleCountPeople}
                  width="200px"
                >
                  {eventDetails.joinPeople.includes(authContext.user._id)
                    ? "Eliminarme"
                    : "Apuntarme"}
                </button>
              </div>
              <div className="genteicono">
                <Card.Img
                  className="iconogente"
                  src="/images/icons8-people-50.png"
                  alt="people icon"
                  width={"40px"}
                />
                <Card.Text className="numeropersonas">
                  {eventDetails.joinPeople.length} Personas se han apuntado
                </Card.Text>
              </div>
            </div>
          </div>
        </Card.Body>

        <Card.Body className="galleryContainer">
          <div className="hrContainer">
            <hr className="custom-hr" />
          </div>
          <div className="tituloseparacion">
            <h2>Galeria de Fotos</h2>
          </div>
          {eventDetails.gallery && eventDetails.gallery.length > 0 ? (
            <div className="myGalleryContainer">
              {eventDetails.gallery.map((image, index) => (
                <div className="myEachGallery" key={index}>
                  <Card.Img
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
          <div className="hrContainer">
            <hr className="custom-hr" />
          </div>
          <div className="tituloseparacion">
            <h2>Aftermovie Oficial</h2>
          </div>
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
        </Card.Body>
      </Card>
    </div>
  );
}

export default EventDetailsComponents;

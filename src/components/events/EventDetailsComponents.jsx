import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import Card from "react-bootstrap/Card";

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
      response.data.date = new Date(response.data.date)
        .toISOString()
        .slice(0, 10);
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
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div className="eventDetailsPage">
      {/* <h3>Detalles del Evento</h3> */}
      <div className="separadorbtns">
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
      </div>
      {isFormVisible ? (
        <EditEvent
          eventDetails={eventDetails}
          getData={getData}
          djsArr={allDjs}
          locationsArr={allLocations}
        />
      ) : null}

      <Card className="myDetailsCard">
        <Card.Body className="myFirstDiv">
          <div className="divIzquierda">
            <Card.Img
              className="myCartel"
              src={eventDetails.image}
              alt="imagen"
              width={"200px"}
            />
          </div>

          <div className="divDerecha">
            <div className="TitulodetallesContainer">
              <Card.Title className="TitulodetallesContainerText">
                {eventDetails.title}
              </Card.Title>
            </div>
            <div className="DatedetallesContainer">
              <Card.Text> {eventDetails.date}</Card.Text>
            </div>
            <div className="LocationdetallesContainer">
              <Card.Img src="/images/icons8-location-50.png" alt="asd" />
              <Link to={`/locations/${eventDetails.location}`}>
                <Card.Text>{eventDetails.location.name}</Card.Text>
              </Link>
            </div>
            <div className="djsFix">
              <Link to={`/djs`}>
                <div className="djscontainer">
                  {eventDetails.djs.map((eachDjs) => {
                    return (
                      <div key={eachDjs._id} className="centraciondjs">
                        <Card.Text>{eachDjs.name}</Card.Text>
                        <div className="djsImagencontenedor">
                          <Card.Img
                            className="djDetailsImg"
                            src={eachDjs.image}
                            alt="img"
                            width={"100px"}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Link>
            </div>

            <div className="gentequeva">
              <div className="botoncontainer">
                <button
                  className="myButtons"
                  onClick={handlecountPeople}
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
                  alt="img"
                  width={"40px"}
                />
                <Card.Text className="numeropersonas">
                  {eventDetails.joinPeople.length} Personas se han apuntado{" "}
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
          <div>
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

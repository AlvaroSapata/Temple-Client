import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddEventForm from "../../components/events/AddEventForm";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../../services/locations.services";
import { getAllDjsService } from "../../services/djs.services";
import { getAllEventsService } from "../../services/events.services";
import { AuthContext } from "../../context/auth.context.js";
import Card from "react-bootstrap/Card";


function Events() {
  const navigate = useNavigate();
  // Destructuracion
  const { isAdmin } = useContext(AuthContext);

  const [events, setEvents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [djs, setDjs] = useState([]);

  const [locations, setLocations] = useState([]);

  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [pastEvents, setPastEvents] = useState([]);
  const [nextEvents, setNextEvents] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getAllLocationsService();
      setLocations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await getAllDjsService();
      setDjs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await getAllEventsService();
      const responseClone = [...response.data];
      /*       responseClone.forEach((eachEvent) => {
        eachEvent.date = new Date(eachEvent.date).toLocaleDateString();
      }); */

      setEvents(responseClone);
      setIsLoading(false);

      const thisDate = new Date();

      const past = responseClone.filter(
        (eachEvent) => new Date(eachEvent.date) < thisDate
      );
      const next = responseClone.filter(
        (eachEvent) => new Date(eachEvent.date) > thisDate
      );
      past.forEach((eachEvent) => {
        eachEvent.date = new Date(eachEvent.date).toISOString().slice(0, 10);
      });

      next.forEach((eachEvent) => {
        eachEvent.date = new Date(eachEvent.date).toISOString().slice(0, 10);
      });

      setPastEvents(past);
      setNextEvents(next);
    } catch (error) {
      navigate("/error");
    }
  };

  // Muestra/esconde el formulario
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Estado de loading
  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;
  }
  return (
    <div className="eventsPage">
      {isAdmin ? (
        <button className="myButtons" onClick={toggleForm}>
          Añadir Evento
        </button>
      ) : null}

      {isFormVisible ? (
        <AddEventForm
          getData={getData}
          setIsLoading={setIsLoading}
          djsArr={djs}
          locationsArr={locations}
          toggleForm={toggleForm}
        />
      ) : null}
      <h3>Proximos Eventos:</h3>
      <div className="myEventsList">
        {nextEvents.map((eachEvent) => (
          <Link to={`/events/${eachEvent._id}`} key={eachEvent._id}>
          <Card className="myEventsCardStyle">
              <div className="myEventsCardTitle">
                <Card.Title>{eachEvent.title}</Card.Title>
              </div>
              <div className="myEventsListImgContainer">
                <Card.Img src={eachEvent.image} alt="imagen" />
              </div>
              <Card.Body>
                <div className="myEventsListDateContainer">
                  <Card.Text>{eachEvent.date}</Card.Text>
                </div>
                <div className="myEventsListLocationContainer">
                  <Card.Img
                    className="myEventsListLocationContainerImg"
                    src="images/icons8-location-50.png"
                    alt="imagen"
                  />
                  <Card.Text>{eachEvent.location?.name}</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
      <h3>Eventos Pasados:</h3>
      <div className="myEventsList">
        {pastEvents.map((eachEvent) => (
          <Link to={`/events/${eachEvent._id}`} key={eachEvent._id}>
            <Card className="myEventsCardStyle">
              <div className="myEventsCardTitle">
                <Card.Title>{eachEvent.title}</Card.Title>
              </div>
              <div className="myEventsListImgContainer">
                <Card.Img src={eachEvent.image} alt="imagen" />
              </div>
              <Card.Body>
                <div className="myEventsListDateContainer">
                  <Card.Text>{eachEvent.date}</Card.Text>
                </div>
                <div className="myEventsListLocationContainer">
                  <Card.Img
                    className="myEventsListLocationContainerImg"
                    src="images/icons8-location-50.png"
                    alt="imagen"
                  />
                  <Card.Text>{eachEvent.location?.name}</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Events;

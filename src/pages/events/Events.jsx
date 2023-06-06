import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddEventForm from "../../components/events/AddEventForm";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../../services/locations.services";
import { getAllDjsService } from "../../services/djs.services";
import { getAllEventsService } from "../../services/events.services";
import { AuthContext } from "../../context/auth.context.js";

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
      responseClone.forEach((eachEvent) => {
        eachEvent.date = new Date(eachEvent.date).toLocaleDateString();
      });

      setEvents(responseClone);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
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
    <div>
      <h3>Nuestros Eventos</h3>
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
        />
      ) : null}
      {events.map((eachEvent) => {
        return (
          <Link to={`/events/${eachEvent._id}`} key={eachEvent._id}>
            <div>
              <h4>{eachEvent.title}</h4>
              <img src={eachEvent.image} alt="imagen" width={"200px"} />
              <p>{eachEvent.date}</p>
              <p>{eachEvent.location?.name}</p>
              {/* PONER QUE APAREZCAN TODOS LOS DJS */}
              {eachEvent.djs.map((eachDj) => {
                return <p key={eachDj._id}>{eachDj.name}</p>;
              })}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Events;

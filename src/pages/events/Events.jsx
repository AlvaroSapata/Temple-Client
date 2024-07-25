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
  const { isAdmin } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [djs, setDjs] = useState([]);
  const [locations, setLocations] = useState([]);
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
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await getAllDjsService();
      setDjs(response.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await getAllEventsService();
      const eventsData = response.data;

      setEvents(eventsData);

      const thisDate = new Date();
      const past = eventsData.filter(
        (eachEvent) => new Date(eachEvent.date) < thisDate
      );
      const next = eventsData.filter(
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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div className="eventsPage">
      {isAdmin && (
        <button className="myButtons" onClick={toggleForm}>
          Añadir Evento
        </button>
      )}

      {isFormVisible && (
        <AddEventForm
          getData={getData}
          setIsLoading={setIsLoading}
          djsArr={djs}
          locationsArr={locations}
          toggleForm={toggleForm}
        />
      )}

      {nextEvents.length > 0 && (
        <>
          <h3>Proximos Eventos:</h3>
          <div className="myEventsList">
            {nextEvents.map((eachEvent) => (
              <Link to={`/events/${eachEvent._id}`} key={eachEvent._id}>
                <div>
                  <div className="mycardIG">
                    <div className="myimageIG">
                      <img src={eachEvent.image} alt="eachImg" />
                    </div>
                    <div className="mytextIG">
                      <div className="mymainIG">
                        <span>{eachEvent.title}</span>
                      </div>
                      <div className="mysubIG">
                        <span>
                          <img src="images/icons8-location-50.png" alt="eachImg" />
                          {eachEvent.location?.name}
                        </span>
                      </div>
                    </div>
                    <div className="mydateIG">
                      <span>{eachEvent.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <h3>Eventos Pasados:</h3>
      <div className="myEventsList">
        {pastEvents.map((eachEvent) => (
          <Link to={`/events/${eachEvent._id}`} key={eachEvent._id}>
            <div>
              <div className="mycardIG">
                <div className="myimageIG">
                  <img src={eachEvent.image} alt="eachImg" />
                </div>
                <div className="mytextIG">
                  <div className="mymainIG">
                    <span>{eachEvent.title}</span>
                  </div>
                  <div className="mysubIG">
                    <span>
                      <img src="images/icons8-location-50.png" alt="eachImg" />
                      {eachEvent.location?.name}
                    </span>
                  </div>
                </div>
                <div className="mydateIG">
                  <span>{eachEvent.date}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Events;

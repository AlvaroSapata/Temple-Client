import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../services/locations.services.js";
import { getAllDjsService } from "../services/djs.services.js";
import { getAllEventsService } from "../services/events.services.js";
import { AuthContext } from "../context/auth.context.js";
import { Carousel, Card } from "react-bootstrap";

function Home() {
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [djs, setDjs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [nextEvents, setNextEvents] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const locationsResponse = await getAllLocationsService();
      setLocations(locationsResponse.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const djsResponse = await getAllDjsService();
      setDjs(djsResponse.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const eventsResponse = await getAllEventsService();
      const eventsData = eventsResponse.data;

      setEvents(eventsData);

      const thisDate = new Date();
      const next = eventsData.filter(
        (eachEvent) => new Date(eachEvent.date) > thisDate
      );
      next.forEach((eachEvent) => {
        eachEvent.date = new Date(eachEvent.date).toLocaleDateString();
      });

      setNextEvents(next);
    } catch (error) {
      navigate("/error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div className="eventsPage">
      <div className="Divgrandehome">
        <div className="divfondo">
          <img src="/images/ImagenHomeTemple.png" alt="img" />
        </div>
      </div>

      <div className="carousel-container">
        {nextEvents.length > 0 ? (
          <div className="carousel-slide">
            <h5>Proximos Eventos:</h5>
            <Carousel interval={3000} ride="carousel" wrap={true}>
              {nextEvents.map((eachEvent) => (
                <Carousel.Item key={eachEvent._id}>
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
                              <img
                                src="images/icons8-location-50.png"
                                alt="eachImg"
                              />
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
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="homePastEvents">
            <Link to="/events">
              No hay eventos proximamente, checkea aquí los eventos pasados
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

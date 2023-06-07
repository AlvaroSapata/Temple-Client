import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AddEventForm from "../components/events/AddEventForm";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../services/locations.services.js";
import { getAllDjsService } from "../services/djs.services.js";
import { getAllEventsService } from "../services/events.services.js";
import { AuthContext } from "../context/auth.context.js";
import { Carousel, Card } from 'react-bootstrap';

function Home() {

  const navigate = useNavigate();
  // Destructuracion
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

      const next = responseClone.filter(
        (eachEvent) => new Date(eachEvent.date) > thisDate
      );


      setNextEvents(next);
    } catch (error) {
      navigate("/error");
    }
  };

  // Estado de loading
  if (isLoading) {
    return <ScaleLoader color="#36d7b7" className="myLoader" />;
  }
  return (
    <div className="eventsPage">
            
      <h2>Bienvenidos a TEMPLE</h2>
      <h4>Tasty Electronic Music</h4>
      <h3>Proximos Eventos:</h3>
      <div className="carousel-container">
      <div className="carousel-slide">
      
      <Carousel interval={1000} ride="carousel" wrap={true}>
        {nextEvents.map((eachEvent) => (
          <Carousel.Item key={eachEvent._id}>
            <Link to={`/events/${eachEvent._id}`}>
              <Card className="myEventsCardStyle">
                <Card.Title>{eachEvent.title}</Card.Title>
                <Card.Img src={eachEvent.image} alt="imagen" width={"200px"} />
                <Card.Body>
                  <Card.Text>{eachEvent.date}</Card.Text>
                  <Card.Text>{eachEvent.location?.name}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
      </div>
    </div>
  
      
    </div>
  );
}

export default Home
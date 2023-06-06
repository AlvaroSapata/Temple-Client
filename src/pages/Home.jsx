import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AddEventForm from "../components/events/AddEventForm";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../services/locations.services";
import { getAllDjsService } from "../services/djs.services";
import { getAllEventsService } from "../services/events.services";
import { AuthContext } from "../context/auth.context.js";
import Card from "react-bootstrap/Card";

function Home() {

  const navigate = useNavigate();
  // Destructuracion
  const { isAdmin } = useContext(AuthContext);

  // const [events, setEvents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

   const [djs, setDjs] = useState([]);

  const [locations, setLocations] = useState([]);
  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [nextEvents, setNextEvents] = useState([]);

  // const [esAdministrador, setEsAdministrador] = useState(false);


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

      const thisDate = new Date();

      
      const next = responseClone.filter(
        (eachEvent) => new Date(eachEvent.date) > thisDate
      );

      setNextEvents(next);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
    }
  };
  

  if (isLoading) {
    return <ScaleLoader color="#36d7b7" className="myLoader" />;
  }
  return (
    <div>

<h3>Proximos Eventos:</h3>
      <div className="myEventsList">
        {nextEvents.map((eachEvent) => (
          <Link to={`/events/${eachEvent._id}`} key={eachEvent._id}>
            <Card className="myEventsCardStyle">
              <Card.Title>{eachEvent.title}</Card.Title>
              <Card.Img src={eachEvent.image} alt="imagen" width={"200px"} />
              <Card.Body>
                <Card.Text>{eachEvent.date}</Card.Text>
                <Card.Text>{eachEvent.location?.name}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Home
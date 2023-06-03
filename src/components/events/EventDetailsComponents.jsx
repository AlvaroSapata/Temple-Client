import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteEventsService,
  getEventsDetailsService,
} from "../../services/events.services";
import EditEvent from "./EditEvents";

function EventDetailsComponents(props) {
  const params = useParams();
  console.log(params);
  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState(null);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getEventsDetailsService(params.eventsId);

      console.log(response);
      setEventDetails(response.data);
      setIsLoading(false);
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
  if (isLoading) {
    return <h3>...buscando</h3>;
  }

  return (
    <div>
      <h3>Detalles del Evento</h3>
      <div>
        <p>{eventDetails.title}</p>
        <p>{eventDetails.date}</p>
        <img src={eventDetails.image} alt="imagen" width={"200px"} />
        <p>GALERIIIIA</p>
        <p>AFTER MOVIIIIE</p>
        {eventDetails.djs.map((eachDjs)=>{
          return <p>{eachDjs.name}</p>
        })}

        <p>{eventDetails.joinPeople.length}</p>
      </div>
      <button className="myButtons" onClick={handleDelete}>eliminar</button>
      <button className="myButtons">editar</button>
      <EditEvent eventDetails={eventDetails} getData={getData} djs={eventDetails.djs} />
      
    </div>
  );
}

export default EventDetailsComponents;

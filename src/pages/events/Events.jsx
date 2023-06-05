import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import AddEventForm from "../../components/events/AddEventForm";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getAllLocationsService } from "../../services/locations.services";
import { getAllDjsService } from "../../services/djs.services";
import { getAllEventsService } from "../../services/events.services";


function Events() {

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [djs, setDjs] = useState([]);

  const [locations, setLocations] = useState([]);

  
  useEffect(() => {
    getData()
  }, [])


  const getData = async () => {

    try {
      const response = await getAllLocationsService()
      
      setLocations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }

    try{
       const response = await getAllDjsService()
       setDjs(response.data);
      setIsLoading(false);
    }catch(error){
      console.log(error);
    }

    try {
      const response = await getAllEventsService()
      
      setEvents(response.data);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
    }


    if (isLoading) {
      return <ScaleLoader color="#36d7b7" className="myLoader" />;
    }

  }
  return (
    <div>

      <h3>Nuestros Eventos</h3>
     
      <AddEventForm getData={getData} setIsLoading={setIsLoading} djsArr={djs} locationsArr={locations} />
      

      {events.map((eachEvent)=>{
        return (
          <Link to={`/events/${eachEvent._id}`}>
          <div key={eachEvent._id}>
            <h4>{eachEvent.title}</h4>
            <img src={eachEvent.image} alt="imagen" width={"200px"}/>
            <p>{eachEvent.date}</p>
            <p>{eachEvent.location?.name}</p>
            <p>{eachEvent.djs[0].name}</p>
            

          </div>
            </Link>
        )
      })}
    </div>
  )
}

export default Events
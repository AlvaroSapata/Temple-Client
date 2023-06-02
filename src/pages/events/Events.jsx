import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import AddEventForm from "../../components/events/AddEventForm";


function Events() {

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [djs, setDjs] = useState([]);

  const [location, setLocation] = useState("");

  useEffect(() => {
    getData()
  }, [])


  const getData = async () => {

    try{
       const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/djs`)
       setDjs(response.data);
      setIsLoading(false);
    }catch(error){
      console.log(error);
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/events`
      )
      console.log(response);
      setEvents(response.data);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
    }


    if (isLoading) {
      return <h3>Cargando...</h3>;
    }

  }
  return (
    <div>

      <h3>Nuestros Eventos</h3>
      <AddEventForm getData={getData} setIsLoading={setIsLoading} djsArr={djs} locationArr={location} />

      {events.map((eachEvent)=>{
        return (
          <div key={eachEvent.id}>
            <h4>{eachEvent.title}</h4>
            <img src={eachEvent.image} alt="imagen" />
            <p>{eachEvent.date.toLocalDateString()}</p>
            

          </div>
        )
      })}
    </div>
  )
}

export default Events
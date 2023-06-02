
import { useEffect, useState } from "react";
import { editEventsService } from "../../services/events.services";
import { useNavigate } from "react-router-dom";

function EditEvents(props) {
    
    const { eventDetails, getData, djs} = props;

    

    const navigate = useNavigate();
  
   const [title, setTitle] = useState(eventDetails.title);
   const [image, setImage] = useState(eventDetails.image);
   const [date, setDate] = useState(eventDetails.date);
   const [location, setLocation] = useState(eventDetails.location);
   const [gallery, setGallery] = useState(eventDetails.gallery);
   const[afterMovie, setAfterMovie] = useState(eventDetails.afterMovie);

  
  
    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleImageChange = (e) => setImage(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);
    const handleLocationChange = (e) => setLocation(e.target.value);
    const handleGalleryChange = (e) => setGallery(e.target.value);
    const handleAfterMovieChange = (e) => setAfterMovie(e.target.value);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const updatedEvent = {
          title,
          image,
          date,
          location,
          gallery,
          afterMovie,
        };
        await editEventsService(eventDetails._id, updatedEvent);
        console.log("evento actualizada");
        navigate("/events");
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getData();
    }, []);
  
  
  
    return (
      
      <div key={eventDetails._id}>
        <p className="name">{eventDetails.title}</p>
        <form onSubmit={handleSubmit} >
          <label htmlFor="name">Titulo</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
          <br />
          <label htmlFor="description">Imagen</label>
          <input
            type="text"
            name="image"
            id="image"
            value={image}
            onChange={handleImageChange}
          />
          <br />
          <label htmlFor="image">FECHA</label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={handleDateChange}
          />
          <br />
          <label htmlFor="price">Localizacion</label>
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={handleLocationChange}
            //!PREGUNTAR LOCATION
          />
          <br />

          <label htmlFor="price">Galeria</label>
          <input
            type="text"
            name="gallery"
            id="gallery"
            value={gallery}
            onChange={handleGalleryChange}
          />
          <br />
          <label htmlFor="price">After Movie</label>
          <input
            type="text"
            name="afterMovie"
            id="afterMovie"
            value={afterMovie}
            onChange={handleAfterMovieChange}
          />
          <br />

          <button>Aceptar cambios</button>
          <br />
        </form>

        {/* PREGUNTAR SOBRE LOS DJS */}
      </div>
    );
 
}

export default EditEvents
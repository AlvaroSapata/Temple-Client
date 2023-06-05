import { useEffect, useState } from "react";
import { editEventsService } from "../../services/events.services";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";

function EditEvents(props) {
  const { eventDetails, getData, djsArr, locationsArr } = props;
  console.log("EventDetails", eventDetails.djs);
  console.log("DjsArr",djsArr)

  const navigate = useNavigate();

  const [title, setTitle] = useState(eventDetails.title);
  const [image, setImage] = useState(eventDetails.image);
  const [date, setDate] = useState(eventDetails.date);
  // const [location, setLocation] = useState(eventDetails.location);
  const [gallery, setGallery] = useState(eventDetails.gallery);
  const [afterMovie, setAfterMovie] = useState(eventDetails.afterMovie);

  const [locationsSelected, setLocationsSelected] = useState(eventDetails.location);
  const [djsSelected, setDjsSelected] = useState(eventDetails.djs);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  // const handleLocationChange = (e) => setLocation(e.target.value);
  const handleGalleryChange = (e) => setGallery(e.target.value);
  const handleAfterMovieChange = (e) => setAfterMovie(e.target.value);

  const handleSelectedLocations = (e) => setLocationsSelected(e.target.value);
/*   const handleSelectedDjs = (e) => {
    setDjsSelected(e.target.options);
  console.log(e.target.options)
  } */

  const handleSelectedDjs = (e) => {
    // hacemos copia con spread para convetir de html element a array
    const copyDjs = [...e.target.children]
    // filtrar ...
    const filteredDjs= copyDjs.filter((eachDj)=>{
      return eachDj.selected
      
     })
     // Iteramos devolviendo los valores de cada dj filtrado
      const djsIds =  filteredDjs.map((eachDj)=>{
       return eachDj.value
     }) 
     // Actualizamos el estado
     setDjsSelected(djsIds);
     
   };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedEvent = {
        title,
        image,
        date,
        location: locationsSelected,
        gallery,
        afterMovie,
        djs:djsSelected
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Titulo</label>
        <input
          type="text"
          name="name"
          id="name"
          value={title}
          onChange={handleTitleChange}
        />
        <br />
        <label htmlFor="description">Imagen</label>
        <input
          type="text"
          name="description"
          id="description"
          value={image}
          onChange={handleImageChange}
        />
        <br />
        <label htmlFor="date">FECHA</label>
        <input
          type="date"
          name="date"
          id="date"
          value={date}
          onChange={handleDateChange}
        />
        <br />

        <br />
        <label htmlFor="location">Ubicacion</label>
        <Form.Select
          id="dropdown-basic-button"
          title="Dropdown button"
          onChange={handleSelectedLocations}
          value={locationsSelected}
        >
          {locationsArr.map((eachLocation) => {
            if (eachLocation._id === locationsSelected) {
              return (
                <option
                  key={eachLocation._id}
                  value={eachLocation._id}
                  selected={true}
                >
                  {eachLocation.name}
                </option>
              );
            } else {
              return (
                <option key={eachLocation._id} value={eachLocation._id}>
                  {eachLocation.name}
                </option>
              );
            }
          })}
        </Form.Select>
        <br />
        <label htmlFor="djs">DJS</label>
        <Form.Select multiple={true} onChange={handleSelectedDjs} value={djsSelected}>
          {djsArr.map((eachDjs) => {
            if (eventDetails.djs.includes(eachDjs._id)) {
              return (
                <option key={eachDjs._id} value={eachDjs._id} selected={true}>
                  {eachDjs.name}
                </option>
              );
            } else {
              return (
                <option key={eachDjs._id} value={eachDjs._id}>
                  {eachDjs.name}
                </option>
              );
            }
          })}
        </Form.Select>
        <br />

        <label htmlFor="gallery">Galeria</label>
        <input
          type="text"
          name="gallery"
          id="gallery"
          value={gallery}
          onChange={handleGalleryChange}
        />
        <br />
        <label htmlFor="afterMovie">After Movie</label>
        <input
          type="text"
          name="afterMovie"
          id="afterMovie"
          value={afterMovie}
          onChange={handleAfterMovieChange}
        />

        <br />

        <button className="myButtons">Aceptar cambios</button>
        <br />
      </form>

      {/* PREGUNTAR SOBRE LOS DJS */}
    </div>
  );
}

export default EditEvents;

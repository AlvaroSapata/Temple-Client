import { useState } from "react";
import { createEventService } from "../../services/events.services";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function AddEventForm(props) {

    console.log(props.djsArr);
  const { setIsLoading, getData, djsArr, locationArr } = props;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [gallery, setGallery] = useState("");
  const [afterMovie, setAfterMovie] = useState("");
//   const [djs, setDjs] = useState(djsArr);
  
//   const [ischecked, setIsChecked] = useState(false);
   
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleGalleryChange = (e) => setGallery(e.target.value);
  const handleAfterMovieChange = (e) => setAfterMovie(e.target.value);
//   const handleDjsChange = (e) => setDjs(e.target.value);
 
//   const handleCheckboxChange = (e) => setIsChecked(!ischecked);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("apretando el boton");
    setIsLoading(true);

    try {
      const newEvent = {
        title: title,
        image: image,
        date: date,
        location: location,
        gallery: gallery,
        afterMovie: afterMovie,
        djs: djsArr,
        
      };

      await createEventService(newEvent);
      getData();
    } catch (error) {
      console.log(error);
    }


  };
  return (
    <div className="myEventFormContainer">
      <h3>Añadir Evento</h3>

      <form onSubmit={handleSubmit} className="myEventForm">
        <label htmlFor="title">titulo</label>
        <input
          type="text"
          name="title"
          onChange={handleTitleChange}
          value={title}
        />

        <br />
        <label htmlFor="image">image</label>
        <input
          type="text"
          name="image"
          onChange={handleImageChange}
          value={image}
        />

        <br />
        <label htmlFor="date">Fecha</label>
        <input
          type="date"
          name="date"
          onChange={handleDateChange}
          value={date}
        />

        <br />

        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        {locationArr.map((eachLocation)=>{
         return(
          <div key={eachLocation._id}>
      <Dropdown.Item href={eachLocation}>{eachLocation}</Dropdown.Item>
      
      </div>
         )
        })}
    </DropdownButton>

        {/* <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          onChange={handleLocationChange}
          value={location}
        /> */}

        <br />

        <label htmlFor="gallery">Gallery</label>
        <input
          type="text"
          name="gallery"
          onChange={handleGalleryChange}
          value={gallery}
          />

                  <br />

                  <label htmlFor="afterMovie">After Movie</label>
                  <input
                    type="text"
                    name="afterMovie"
                    onChange={handleAfterMovieChange}
                    value={afterMovie}
                  />
                  <br />
                  <label htmlFor="djs">DJS</label>
                 {djsArr.map((eachDjs)=>{
                    console.log(eachDjs.name);
                    return(
                        <div key={eachDjs._id}>

                        <p>{eachDjs.name}</p>
                  <input
                    type="checkbox"
                    name="djs"
                    // checked={false}
                    // onChange={handleCheckboxChange}
                    value={eachDjs._id}
                  />
                        </div>
                    )
                  })}
                  <br />

                 
               

                  <button type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default AddEventForm;

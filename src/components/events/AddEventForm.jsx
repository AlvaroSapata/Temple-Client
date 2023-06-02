import { useState } from "react";
import { createEventService } from "../../services/events.services";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
function AddEventForm(props) {
  // console.log(props.djsArr);
  const { setIsLoading, getData, djsArr, locationsArr } = props;

  // console.log(locationsArr);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  // const [location, setLocation] = useState("");
  const [gallery, setGallery] = useState("");
  const [afterMovie, setAfterMovie] = useState("");
    const [djs, setDjs] = useState([]);
  const [locationsSelected, setLocationsSelected] = useState("");

  const handleselectedLocations = (e) => {
    setLocationsSelected(e.target.value);
    console.log(e.target.value);
  };

  const handleselectedDjs = (e) => {
   const copyDjs = [...e.target.children]
   const filteredDjs= copyDjs.filter((eachDj)=>{
     return eachDj.selected
     
    })
     const djsIds =  filteredDjs.map((eachDj)=>{
      return eachDj.value
    }) 
    setDjs(djsIds);
    
  };
  
  //   const [ischecked, setIsChecked] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  // const handleLocationChange = (e) => setLocation(e.target.value);
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
        location: locationsSelected,
        gallery: gallery,
        afterMovie: afterMovie,
        djs: djs,
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

        <Form.Select
          id="dropdown-basic-button"
          title="Dropdown button"
          onChange={handleselectedLocations}
        >
          {locationsArr.map((eachLocation) => {
            return (
              <option key={eachLocation._id} value={eachLocation._id}>
                {eachLocation.name}
              </option>
            );
          })}
        </Form.Select>

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
        <Form.Select multiple={true} onChange={handleselectedDjs}>
          {djsArr.map((eachDjs) => {
            return (
              <option key={eachDjs._id} value={eachDjs._id}> {eachDjs.name}</option>

              // checked={false}
              // onChange={handleCheckboxChange}
            );
          })}
        </Form.Select>
        <br />

        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default AddEventForm;

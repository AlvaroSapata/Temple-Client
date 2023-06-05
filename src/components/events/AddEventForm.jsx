import { useState } from "react";
import { createEventService } from "../../services/events.services";
import Form from "react-bootstrap/Form";

import { uploadImageService } from "../../services/upload.services";
import { useNavigate } from "react-router-dom";
function AddEventForm(props) {
  // console.log(props.djsArr);
  const { setIsLoading, getData, djsArr, locationsArr } = props;
  const navigate = useNavigate();
  // console.log(locationsArr);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  // const [location, setLocation] = useState("");
  const [gallery, setGallery] = useState("");
  const [afterMovie, setAfterMovie] = useState("");
    const [djs, setDjs] = useState([]);
  const [locationsSelected, setLocationsSelected] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


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
        image: imageUrl,
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


  const handleFileUpload = async (event) => {
    // console.log("The file to be uploaded is: ", e.target.files[0]);

    if (!event.target.files[0]) {
      // to prevent accidentally clicking the choose file button and not selecting a file
      return;
    }

    setIsUploading(true); // to start the loading animation

    const uploadData = new FormData(); // images and other files need to be sent to the backend in a FormData
    uploadData.append("image", event.target.files[0]);
    //                   |
    //     this name needs to match the name used in the middleware => uploader.single("image")

    try {
      const response = await uploadImageService(uploadData);
      // or below line if not using services
      // const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, uploadData)

      setImageUrl(response.data.imageUrl);
      //                          |
      //     this is how the backend sends the image to the frontend => res.json({ imageUrl: req.file.path });

      setIsUploading(false); // to stop the loading animation
    } catch (error) {
      navigate("/error");
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
        <div>
          <label>Image: </label>
          <input
            type="file"
            name="image"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          {/* below disabled prevents the user from attempting another upload while one is already happening */}
        </div>

        {/* to render a loading message or spinner while uploading the picture */}
        {isUploading ? <h3>... uploading image</h3> : null}

        {/* below line will render a preview of the image from cloudinary */}
        {imageUrl ? (
          <div>
            <img src={imageUrl} alt="img" width={200} />
          </div>
        ) : null}
        <br />
        <label htmlFor="date">Fecha</label>
        <input
          type="date"
          name="date"
          onChange={handleDateChange}
          value={date}
        />

        <br />
        <label htmlFor="location">Ubicacion</label>
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

        <br />

        <label htmlFor="gallery">Galeria de Fotografias</label>
        <input
          type="text"
          name="gallery"
          onChange={handleGalleryChange}
          value={gallery}
        />

        <br />

        <label htmlFor="afterMovie">Aftermovie</label>
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
            );
          })}
        </Form.Select>
        <br />

        <button className="myButtons" type="submit">Agregar</button>
      </form>
    </div>
  );
}

export default AddEventForm;

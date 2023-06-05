import { useEffect, useState } from "react";
import { editEventsService } from "../../services/events.services";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { uploadImageService } from "../../services/upload.services";

function EditEvents(props) {
  const { eventDetails, getData, djsArr, locationsArr } = props;
  console.log("EventDetails", eventDetails.djs);
  console.log("DjsArr",djsArr)

  const navigate = useNavigate();

  const [title, setTitle] = useState(eventDetails.title);
  // const [image, setImage] = useState(eventDetails.image);
  const [date, setDate] = useState(eventDetails.date);
  // const [location, setLocation] = useState(eventDetails.location);
  const [gallery, setGallery] = useState(eventDetails.gallery);
  // const [afterMovie, setAfterMovie] = useState(eventDetails.afterMovie);

  const [locationsSelected, setLocationsSelected] = useState(eventDetails.location);
  const [djsSelected, setDjsSelected] = useState(eventDetails.djs);

 console.log(eventDetails);
  const [videoUrl, setVideoUrl] = useState(null)
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  // const handleImageChange = (e) => setImage(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  // const handleLocationChange = (e) => setLocation(e.target.value);
  const handleGalleryChange = (e) => setGallery(e.target.value);
  // const handleAfterMovieChange = (e) => setAfterMovie(e.target.value);

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
        image: imageUrl,
        date,
        location: locationsSelected,
        gallery,
        afterMovie: videoUrl,
        djs:djsSelected
      };
      await editEventsService(eventDetails._id, updatedEvent);
      console.log("evento actualizada");
      navigate("/events");
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


  const handleVideoUpload = async (event) => {
    // console.log("The file to be uploaded is: ", e.target.files[0]);

    if (!event.target.files[0]) {
      // to prevent accidentally clicking the choose file button and not selecting a file
      return;
    }

    setIsUploading(true); // to start the loading animation

    const uploadData = new FormData(); // images and other files need to be sent to the backend in a FormData
    uploadData.append("video", event.target.files[0]);
    //                   |
    //     this name needs to match the name used in the middleware => uploader.single("image")

    try {
      const response = await uploadImageService(uploadData);
      // or below line if not using services
      // const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, uploadData)

     

      setVideoUrl(response.data.videoUrl);
      //                          |
      //     this is how the backend sends the image to the frontend => res.json({ imageUrl: req.file.path });

      setIsUploading(false); // to stop the loading animation
    } catch (error) {
      navigate("/error");
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
        <div>
          <label>After Movie: </label>
          <input
            type="file"
            name="aftermovie"
            onChange={handleVideoUpload}
            disabled={isUploading}
          />

          {/* below disabled prevents the user from attempting another upload while one is already happening */}
        </div>

        {/* to render a loading message or spinner while uploading the picture */}
        {isUploading ? <h3>... uploading image</h3> : null}

        {/* below line will render a preview of the image from cloudinary */}
        {videoUrl ? (
          <div>
            <iframe src={videoUrl} alt="video" width={200} title="video" ></iframe>
          </div>
        ) : null}
        <br />

        <button className="myButtons">Aceptar cambios</button>
        <br />
      </form>

      {/* PREGUNTAR SOBRE LOS DJS */}
    </div>
  );
}

export default EditEvents;

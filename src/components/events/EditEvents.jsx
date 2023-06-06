import { useEffect, useState } from "react";
import { editEventsService } from "../../services/events.services";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { uploadImageService } from "../../services/upload.services";
import { uploadVideoService } from "../../services/upload.services";

function EditEvents(props) {
  const { eventDetails, getData, djsArr, locationsArr } = props;

  const navigate = useNavigate();

  const [title, setTitle] = useState(eventDetails.title);
  const [date, setDate] = useState(eventDetails.date);

  const [locationsSelected, setLocationsSelected] = useState(
    eventDetails.location
  );
  const [djsSelected, setDjsSelected] = useState(eventDetails.djs);

  const [videoUrl, setVideoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  // const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleGalleryImagesChange = (e) => {
    const files = e.target.files;
    const imagesArray = Array.from(files);
    setGalleryImages(imagesArray);
  };

  const handleSelectedLocations = (e) => setLocationsSelected(e.target.value);

  const handleSelectedDjs = (e) => {
    // hacemos copia con spread para convetir de html element a array
    const copyDjs = [...e.target.children];
    // filtrar ...
    const filteredDjs = copyDjs.filter((eachDj) => {
      return eachDj.selected;
    });
    // Iteramos devolviendo los valores de cada dj filtrado
    const djsIds = filteredDjs.map((eachDj) => {
      return eachDj.value;
    });
    // Actualizamos el estado
    setDjsSelected(djsIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Subir las imágenes de la galería
    const galleryUploadPromises = galleryImages.map((image) => {
      const uploadData = new FormData();
      uploadData.append("image", image);
      return uploadImageService(uploadData);
    });

    try {
      // Esperar a que se completen todas las promesas de subida de imágenes
      const galleryUploadResponses = await Promise.all(galleryUploadPromises);

      // Obtener las URL de las imágenes subidas
      const galleryImageUrls = galleryUploadResponses.map(
        (response) => response.data.imageUrl
      );
      const updatedEvent = {
        title,
        image: imageUrl,
        date,
        location: locationsSelected,
        gallery: galleryImageUrls,
        afterMovie: videoUrl,
        djs: djsSelected,
      };
      await editEventsService(eventDetails._id, updatedEvent);
      navigate("/events");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (event) => {
    if (!event.target.files[0]) {
      return;
    }

    setIsUploadingImage(true);

    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);
    //                   |
    //     this name needs to match the name used in the middleware => uploader.single("image")

    try {
      const response = await uploadImageService(uploadData);
      setImageUrl(response.data.imageUrl);
      setIsUploadingImage(false);
    } catch (error) {
      navigate("/error");
    }
  };

  const handleVideoUpload = async (event) => {
    if (!event.target.files[0]) {
      return;
    }

    setIsUploadingVideo(true);

    const uploadData = new FormData();
    uploadData.append("video", event.target.files[0]);
    //                   |
    //     this name needs to match the name used in the middleware => uploader.single("image")

    try {
      const response = await uploadVideoService(uploadData);
      setVideoUrl(response.data.fileUrl);
      setIsUploadingVideo(false);
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
            onChange={handleImageUpload}
            disabled={isUploadingImage}
          />
        </div>

        {isUploadingImage ? <h3>... uploading image</h3> : null}

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
        <Form.Select
          multiple={true}
          onChange={handleSelectedDjs}
          value={djsSelected}
        >
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

        <label htmlFor="galleryImages">Galería de Imágenes</label>
        <input
          type="file"
          name="galleryImages"
          id="galleryImages"
          onChange={handleGalleryImagesChange}
          multiple
        />

        <br />
        <div>
          <label>After Movie: </label>
          <input
            type="file"
            name="aftermovie"
            onChange={handleVideoUpload}
            disabled={isUploadingVideo}
          />
        </div>

        {isUploadingVideo ? <h3>... uploading aftermovie</h3> : null}

        {videoUrl ? (
          <div>
            <iframe
              src={videoUrl}
              alt="video"
              width={200}
              title="video"
            ></iframe>
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

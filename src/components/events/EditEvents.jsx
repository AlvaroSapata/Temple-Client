import { useEffect, useState } from "react";
import { editEventsService } from "../../services/events.services";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { uploadImageService } from "../../services/upload.services";
import { uploadVideoService } from "../../services/upload.services";
import ScaleLoader from "react-spinners/ScaleLoader";

function EditEvents(props) {
  const { eventDetails, getData, djsArr, locationsArr } = props;

  const navigate = useNavigate();

  const [title, setTitle] = useState(eventDetails.title);
  const [date, setDate] = useState(eventDetails.date);

  const [locationsSelected, setLocationsSelected] = useState(
    eventDetails.location
  );
  const [djsSelected, setDjsSelected] = useState(eventDetails.djs);

  const [videoUrl, setVideoUrl] = useState(eventDetails.afterMovie);
  const [imageUrl, setImageUrl] = useState(eventDetails.image);
  const [galleryImageUrls, setGalleryImageUrls] = useState(
    eventDetails.gallery
  );

  const [galleryImages, setGalleryImages] = useState(eventDetails.gallery);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setIsLoading(true);
    try {
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
      if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      }
    }
  };

  const handleImageUpload = async (event) => {
    if (!event.target.files[0]) {
      return;
    }
    setIsUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);

    try {
      const response = await uploadImageService(uploadData);
      setImageUrl(response.data.imageUrl);
      setIsUploadingImage(false);
    } catch (error) {
      if (error.response.status === 400) {
        setErrorMessage("Archivo demasiado grande: 10485760 bytes max");
        setIsLoading(false);
        setIsUploadingImage(false);
      }
    }
  };

  const handleVideoUpload = async (event) => {
    if (!event.target.files[0]) {
      return;
    }
    setIsUploadingVideo(true);
    const uploadData = new FormData();
    uploadData.append("video", event.target.files[0]);
    try {
      const response = await uploadVideoService(uploadData);
      setVideoUrl(response.data.videoUrl);
      setIsUploadingVideo(false);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setErrorMessage("Archivo demasiado grande: 104857600 bytes max");
        setIsLoading(false);
        setIsUploadingImage(false);
      }
    }
  };

  const handleGalleryImagesUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    setIsUploadingGallery(true);

    const files = Array.from(event.target.files);
    const uploadPromises = files.map((file) => {
      const uploadData = new FormData();
      uploadData.append("image", file);
      return uploadImageService(uploadData);
    });

    try {
      const uploadResponses = await Promise.all(uploadPromises);
      const imageUrls = uploadResponses.map(
        (response) => response.data.imageUrl
      );
      setGalleryImageUrls(imageUrls);
      setIsUploadingGallery(false);
    } catch (error) {
      if (error.response.status === 400) {
        setErrorMessage(
          "Alguno de los Archivos es demasiado grande: 10485760 bytes max"
        );
        setIsLoading(false);
        setIsUploadingImage(false);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="myEditEventFormContainer" key={eventDetails._id}>
      <p className="name">{eventDetails.title}</p>
      <Form onSubmit={handleSubmit} className="myEditEventForm">
        <Form.Group className="mb-3" id="formBasicTitle">
          <Form.Label>Titulo</Form.Label>
          <Form.Control
            type="text"
            name="name"
            id="name"
            value={title}
            onChange={handleTitleChange}
          />
        </Form.Group>
        <div>
          <Form.Group className="mb-3" id="formBasicDate">
            <label>Image: </label>
            <input
              type="file"
              name="image"
              onChange={handleImageUpload}
              disabled={isUploadingImage}
            />

            {isUploadingImage ? (
              <ScaleLoader color={"#471971"} loading={true} />
            ) : null}
            {imageUrl ? (
              <div className="preview">
                <img src={imageUrl} alt="img" width={200} />
              </div>
            ) : null}
          </Form.Group>
        </div>

        <Form.Group className="mb-3" id="formBasicEmail">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="date"
            id="date"
            onChange={handleDateChange}
            value={date}
          />
        </Form.Group>

        <Form.Group className="mb-3" id="formBasicLocation">
          <Form.Label>Ubicacion</Form.Label>
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
        </Form.Group>

        <Form.Group className="mb-3" id="formBasicDjs">
          <Form.Label>DJS</Form.Label>
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
        </Form.Group>

        <Form.Group className="mb-3" id="formBasicDate">
          <Form.Label>Galería de Imágenes</Form.Label>

          <Form.Control
            type="file"
            name="galleryImages"
            id="galleryImages"
            onChange={handleGalleryImagesUpload}
            disabled={isUploadingGallery}
            multiple
          />
          {isUploadingGallery ? (
            <ScaleLoader color={"#471971"} loading={true} />
          ) : null}
        </Form.Group>

        <div>
          <Form.Group className="mb-3" id="formBasicDate">
            <Form.Label>After Movie:</Form.Label>

            <Form.Control
              type="file"
              name="afterMovie"
              onChange={handleVideoUpload}
              disabled={isUploadingVideo}
            />

            {isUploadingVideo ? (
              <ScaleLoader color={"#471971"} loading={true} />
            ) : null}
          </Form.Group>
        </div>
        <button className="myButtons" disabled={isLoading}>
          Aceptar cambios
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <br />
      </Form>
    </div>
  );
}

export default EditEvents;

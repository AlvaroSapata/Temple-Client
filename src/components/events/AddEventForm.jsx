import { useState } from "react";
import { createEventService } from "../../services/events.services";
import Form from "react-bootstrap/Form";

import { uploadImageService } from "../../services/upload.services";
import { useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

function AddEventForm(props) {
  const { setIsLoading, getData, djsArr, locationsArr, toggleForm } = props;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [gallery, setGallery] = useState("");
  const [afterMovie, setAfterMovie] = useState("");
  const [djs, setDjs] = useState([]);
  const [locationsSelected, setLocationsSelected] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleselectedLocations = (e) => {
    setLocationsSelected(e.target.value);
  };

  const handleselectedDjs = (e) => {
    const copyDjs = [...e.target.children];
    const filteredDjs = copyDjs.filter((eachDj) => {
      return eachDj.selected;
    });
    const djsIds = filteredDjs.map((eachDj) => {
      return eachDj.value;
    });
    setDjs(djsIds);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (!event.target.files[0]) {
      return;
    }
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);
    try {
      const response = await uploadImageService(uploadData);
      setImageUrl(response.data.imageUrl);
      setIsUploading(false);
    } catch (error) {
      navigate("/error");
    }
  };
  return (
    <div className="myAddEventFormContainer">
      <h3>Añadir Evento</h3>

      <Form
        onSubmit={(event) => {
          handleSubmit(event);
          toggleForm(event);
        }}
        className="myAddEventForm"
      >
        <Form.Group className="mb-3" id="formBasicTitle">
          <Form.Label>titulo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            onChange={handleTitleChange}
            value={title}
          />
        </Form.Group>

        <div>
          <Form.Group className="mb-3" id="formBasicDate">
            <Form.Label>Imagen</Form.Label>
            {isUploading ? (
              <ScaleLoader color={"#471971"} loading={true} />
            ) : null}
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {imageUrl ? (
              <div>
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
            onChange={handleDateChange}
            value={date}
          />
        </Form.Group>

        <Form.Group className="mb-3" id="formBasicLocation">
          <Form.Label>Ubicacion</Form.Label>
          <Form.Select
            id="dropdown-basic-button"
            title="Dropdown button"
            onChange={handleselectedLocations}
          >
          <option disabled={true}>Elige una Ubicacion</option>
            {locationsArr.map((eachLocation) => {
              return (
                <option key={eachLocation._id} value={eachLocation._id}>
                  {eachLocation.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" id="formBasicDjs">
          <Form.Label>DJS</Form.Label>

          <Form.Select multiple={true} onChange={handleselectedDjs}>
            {djsArr.map((eachDjs) => {
              return (
                <option key={eachDjs._id} value={eachDjs._id}>
                  {eachDjs.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <br />

        <button className="myButtons" type="submit">
          Agregar
        </button>
      </Form>
    </div>
  );
}

export default AddEventForm;

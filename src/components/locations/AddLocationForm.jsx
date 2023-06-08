import { useState } from "react";
import { createLocationService } from "../../services/locations.services";
import { uploadImageService } from "../../services/upload.services";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ScaleLoader from "react-spinners/ScaleLoader";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import ClickMarker from "../../components/locations/ClickMarker";

function AddLocationForm(props) {
  const navigate = useNavigate();
  // Destructurar props
  const { getData, toggleForm } = props;

  // Estados para registrar los cambios
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados mapa
  const [coordinates, setCoordinates] = useState(null);
  const [center, setCenter] = useState([
    42.340636415406124, -3.7039897681929457,
  ]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  // const handleImageChange = (e) => setImage(e.target.value);
  //  const handleAdressChange = (e) => setAdress(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newLocation = {
        name,
        image: imageUrl,
        address: coordinates,
        description,
      };
      await createLocationService(newLocation);
      getData();
      toggleForm();
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      }
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
      console.log(error.response);
      if (error.response.status === 400) {
        setErrorMessage("Archivo demasiado grande ( 10485760 bytes max )");
        setIsLoading(false)
        setIsUploading(false)
      }     }
  };

  console.log(coordinates);
  return (
    <div className="myLocationFormContainer">
      <h3>Añadir Ubicacion</h3>

      <Form onSubmit={handleSubmit} className="myProductForm">
        <Form.Group className="mb-3" id="formBasicEmail">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre de la Ubicacion"
            name="name"
            onChange={handleNameChange}
            value={name}
          />
        </Form.Group>
        <Form.Group className="mb-3" id="formBasicEmail">
          <Form.Label>Descripcion</Form.Label>
          <Form.Control
            type="text"
            placeholder="Descripcion de la Ubicacion"
            name="description"
            onChange={handleDescriptionChange}
            value={description}
          />
        </Form.Group>
        <Form.Group className="mb-3" id="formBasicEmail">
          <Form.Label>Imagen</Form.Label>
          {isUploading ? (
            <ScaleLoader color={"#471971"} loading={true} />
          ) : null}
          <Form.Control
            type="file"
            placeholder="Precio del producto"
            name="image"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          {imageUrl ? (
            <div className="preview">
              <img src={imageUrl} alt="img" width={250} />
            </div>
          ) : null}
        </Form.Group>

        
   <div className="mapFixer">
        <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker setCoordinates={setCoordinates} />
          {coordinates !== null && <Marker position={coordinates} />}
        </MapContainer>
</div>
        <button className="myButtons" type="submit" disabled={isLoading}>
          Agregar
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Form>
    </div>
  );
}

export default AddLocationForm;

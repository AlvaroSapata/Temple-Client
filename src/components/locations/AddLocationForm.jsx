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
  const { setIsLoading, getData, toggleForm } = props;

  // Estados para registrar los cambios
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Estados mapa
  const [coordinates, setCoordinates] = useState(null);
  const [center, setCenter] = useState([42.340636415406124, -3.7039897681929457])

  const handleNameChange = (e) => setName(e.target.value);
  // const handleImageChange = (e) => setImage(e.target.value);
  //  const handleAdressChange = (e) => setAdress(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toggleForm();

    try {
      const newLocation = {
        name,
        image: imageUrl,
        address:coordinates,
        description,
      };
      await createLocationService(newLocation);
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

  console.log(coordinates)
  return (
    <div className="myLocationFormContainer">
      <h3>Añadir Ubicacion</h3>

      <Form onSubmit={handleSubmit} className="myProductForm">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre de la Ubicacion"
            name="name"
            onChange={handleNameChange}
            value={name}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Descripcion</Form.Label>
          <Form.Control
            type="text"
            placeholder="Descripcion de la Ubicacion"
            name="description"
            onChange={handleDescriptionChange}
            value={description}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
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
            <div>
              <img src={imageUrl} alt="img" width={250} />
            </div>
          ) : null}
        </Form.Group>

{/*         <Form.Label htmlFor="adress">adress</Form.Label>
        <Form.Control
          type="text"
          name="adress"
          onChange={handleAdressChange}
          value={adress}
        /> */}
        <br />
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker setCoordinates={setCoordinates} />
          {coordinates !== null && <Marker position={coordinates} />}
        </MapContainer>

        <button className="myButtons" type="submit">
          Agregar
        </button>
      </Form>
    </div>
  );
}

export default AddLocationForm;

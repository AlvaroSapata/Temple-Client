import { useEffect, useState } from "react";
import { editLocationService } from "../../services/locations.services";
import { useNavigate } from "react-router-dom";

import { uploadImageService } from "../../services/upload.services";
import Form from "react-bootstrap/Form";
import ScaleLoader from "react-spinners/ScaleLoader";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import ClickMarker from "../../components/locations/ClickMarker";

function EditLocationForm(props) {
  const { locationDetails, getData } = props;

  const navigate = useNavigate();

  const [name, setName] = useState(locationDetails.name);
  const [description, setDescription] = useState(locationDetails.description);


  const [imageUrl, setImageUrl] = useState(locationDetails.image);
  const [isUploading, setIsUploading] = useState(false);

  // Estados mapa
  const [coordinates, setCoordinates] = useState(locationDetails.address);

  const handleNameChange = (e) => setName(e.target.value);

  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = {
        name,
        address: coordinates,
        description,
        image: imageUrl,
      };
      await editLocationService(locationDetails._id, updatedProduct);
      navigate("/locations");
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="myEditLocationContainer">
      <Form onSubmit={handleSubmit} className="myEditLocationForm">
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
            <div>
              <img src={imageUrl} alt="img" width={250} />
            </div>
          ) : null}
        </Form.Group>

        <Form.Label htmlFor="address">Direccion</Form.Label>

        <MapContainer center={coordinates} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker setCoordinates={setCoordinates} />
          {coordinates !== null && <Marker position={coordinates} />}
        </MapContainer>

        <button className="myButtons">Aceptar cambios</button>
        <br />
      </Form>
    </div>
  );
}

export default EditLocationForm;

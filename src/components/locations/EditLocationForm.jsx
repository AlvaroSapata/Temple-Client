import { useEffect, useState } from "react";
import { editLocationService } from "../../services/locations.services";
import { useNavigate } from "react-router-dom";

import { uploadImageService } from "../../services/upload.services";
import Form from "react-bootstrap/Form";
import ScaleLoader from "react-spinners/ScaleLoader";
function EditLocationForm(props) {
  const { locationDetails, getData } = props;

  const navigate = useNavigate();

  const [name, setName] = useState(locationDetails.name);
  const [description, setDescription] = useState(locationDetails.description);
  const [image, setImage] = useState(locationDetails.image);
  const [adress, setAdress] = useState(locationDetails.adress);

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);



  const handleNameChange = (e) => setName(e.target.value);
  const handleAdressChange = (e) => setAdress(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = {
        name,
        adress,
        description,
        image: imageUrl
      };
      await editLocationService(locationDetails._id, updatedProduct);
      // console.log("Ubicacion actualizada");
      navigate("/locations");
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

  useEffect(() => {
    getData();
  }, []);



  return (
    
    <div >
    
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

        <Form.Label htmlFor="adress">adress</Form.Label>
        <Form.Control
          type="text"
          name="adress"
          onChange={handleAdressChange}
          value={adress}
        />
        <br />

        <button className="myButtons">Aceptar cambios</button>
        <br />
      </Form>
    </div>
  );
}

export default EditLocationForm;

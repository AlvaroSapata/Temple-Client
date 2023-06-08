import { useState } from "react";
import { createProductService } from "../../services/products.services";
import { uploadImageService } from "../../services/upload.services";

import Form from "react-bootstrap/Form";
import ScaleLoader from "react-spinners/ScaleLoader";

function AddProductForm(props) {

  // Destructurar props
  const {  getData, toggleForm } = props;

  // Estados para registrar los cambios
  const [name, setName] = useState("");
  // const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleNameChange = (e) => setName(e.target.value);
  // const handleImageChange = (e) => setImage(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("apretando el boton");
    setIsLoading(true);

    try {
      const newProduct = {
        name,
        image: imageUrl,
        price,
        description,
      };
      await createProductService(newProduct);
      getData();
      toggleForm();
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
        setIsLoading(false)
        
      }     }
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
      setImageUrl(response.data.imageUrl);
      setIsUploading(false);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 400) {
        setErrorMessage("Archivo demasiado grande: 10485760 bytes max");
        setIsLoading(false)
        setIsUploading(false)
      } 
    }
  };
  return (
    <div className="myProductFormContainer">
      <h3>Añadir Producto</h3>

      <Form onSubmit={handleSubmit} className="myProductForm">
        <Form.Group className="mb-3" id="formBasicEmail">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del producto"
            name="name"
            onChange={handleNameChange}
            value={name}
          />
        </Form.Group>
        <Form.Group className="mb-3" id="formBasicEmail">
          <Form.Label>Descripcion</Form.Label>
          <Form.Control
            type="text"
            placeholder="Descripcion del producto"
            name="description"
            onChange={handleDescriptionChange}
            value={description}
          />
        </Form.Group>
        <Form.Group className="mb-3" id="formBasicEmail">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            placeholder="Precio del producto"
            name="price"
            onChange={handlePriceChange}
            value={price}
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

          <br />
          {imageUrl ? (
            <div className="preview">
              <img src={imageUrl} alt="img" width={250} />
            </div>
          ) : null}
        </Form.Group>

        <button className="myButtons" type="submit" disabled={isLoading}>
          Agregar
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Form>
    </div>
  );
}

export default AddProductForm;

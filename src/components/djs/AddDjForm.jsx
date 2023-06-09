import { useState } from "react";
import { createDjService } from "../../services/djs.services";
import { uploadImageService } from "../../services/upload.services";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ScaleLoader from "react-spinners/ScaleLoader";

function AddDjForm(props) {
  // Destructurar props
  const { getData, toggleForm } = props;

  const navigate = useNavigate();

  // Estados para registrar los cambios
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newDj = {
        name,
        image: imageUrl,
      };
      await createDjService(newDj);
      getData();
      toggleForm();
    } catch (error) {
      if (error.response.status === 400) {
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
        setIsLoading(false);
        setIsUploading(false);
      }
    }
  };
  return (
    <div className="myDjFormContainer">
      <h3>Añadir Dj</h3>
      <Form onSubmit={handleSubmit} className="myDjForm">
        <Form.Group className="mb-3" id="formBasicTitle">
          <Form.Label htmlFor="title">Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            onChange={handleNameChange}
            value={name}
          />
        </Form.Group>
        <br />
        <div>
          <Form.Group className="mb-3" id="formBasicDate">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileUpload}
              disabled={isUploading}
            />

            {isUploading ? (
              <ScaleLoader color={"#471971"} loading={true} />
            ) : null}

            {imageUrl ? (
              <div className="preview">
                <img src={imageUrl} alt="img" width={200} />
              </div>
            ) : null}
          </Form.Group>
        </div>
        <br />
        <button className="myButtons" type="submit" disabled={isLoading}>
          Agregar
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Form>
    </div>
  );
}
export default AddDjForm;

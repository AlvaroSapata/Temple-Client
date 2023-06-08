import { useState } from "react";
import { createDjService } from "../../services/djs.services";
import { uploadImageService } from "../../services/upload.services";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ScaleLoader from "react-spinners/ScaleLoader";
function AddDjForm(props) {
  // console.log(props.setIsLoading);
  // console.log(props.getData);

  // Destructurar props
  const {  getData, toggleForm } = props;

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


  console.log(errorMessage)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    

    try {
      const newDj = {
        name,
        image: imageUrl
      };
      await createDjService(newDj);
      getData();
      toggleForm();
    } catch (error) {
       
      if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);
        setIsLoading(false)
        
      } 
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
      console.log(error.response);
      if (error.response.status === 400) {
        setErrorMessage("Archivo demasiado grande ( 10485760 bytes max )");
        setIsLoading(false)
        setIsUploading(false)
      }     }
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

          {/* below disabled prevents the user from attempting another upload while one is already happening */}
      

        {/* to render a loading message or spinner while uploading the picture */}
        {isUploading ? (
            <ScaleLoader color={"#471971"} loading={true} />
          ) : null}
        {/* below line will render a preview of the image from cloudinary */}
        {imageUrl ? (
          <div>
            <img src={imageUrl} alt="img" width={200} />
          </div>
        ) : null}
        </Form.Group>
         </div>
        <br />
        <button className="myButtons" type="submit" disabled={isLoading}>Agregar</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Form>
    </div>
  );
}
export default AddDjForm;

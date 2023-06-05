import { useEffect, useState } from "react";
import { editLocationService } from "../../services/locations.services";
import { useNavigate } from "react-router-dom";

import { uploadImageService } from "../../services/upload.services";

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
      console.log("Ubicacion actualizada");
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
      <p className="name">{locationDetails.name}</p>
      <form onSubmit={handleSubmit} className="myBackCardForm">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleNameChange}
        />
        <br />
        <label htmlFor="description">Descripcion</label>
        <input
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <br />
        <div>
          <label>Image: </label>
          <input
            type="file"
            name="image"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          {/* below disabled prevents the user from attempting another upload while one is already happening */}
        </div>

        {/* to render a loading message or spinner while uploading the picture */}
        {isUploading ? <h3>... uploading image</h3> : null}

        {/* below line will render a preview of the image from cloudinary */}
        {imageUrl ? (
          <div>
            <img src={imageUrl} alt="img" width={200} />
          </div>
        ) : null}
        <br />
        <label htmlFor="price">Adress</label>
        <input
          type="text"
          name="adress"
          id="adress"
          value={adress}
          onChange={handleAdressChange}
        />
        <br />
        <button className="myButtons">Aceptar cambios</button>
        <br />
      </form>
    </div>
  );
}

export default EditLocationForm;

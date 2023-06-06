import { useState } from "react";
import { createProductService } from "../../services/products.services";
import { uploadImageService } from "../../services/upload.services";
import { useNavigate } from "react-router-dom";
function AddProductForm(props) {
  // console.log(props.setIsLoading);
  // console.log(props.getData);
  const navigate = useNavigate();
  // Destructurar props
  const { setIsLoading, getData, toggleForm } = props;

  // Estados para registrar los cambios
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("apretando el boton");
    setIsLoading(true);
    toggleForm();

    try {
      const newProduct = {
        name,
        image: imageUrl,
        price,
        description,
      };
      await createProductService(newProduct);
      getData();
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
  return (
    <div className="myProductFormContainer">
      <h3>Añadir Producto</h3>

      <form onSubmit={handleSubmit} className="myProductForm">
        <label htmlFor="name">name</label>
        <input
          type="text"
          name="name"
          onChange={handleNameChange}
          value={name}
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
        <label htmlFor="price">price</label>
        <input
          type="text"
          name="price"
          onChange={handlePriceChange}
          value={price}
        />
        <br />
        <label htmlFor="description">description</label>
        <input
          type="text"
          name="description"
          onChange={handleDescriptionChange}
          value={description}
        />
        <br />
        <button className="myButtons" type="submit">
          Agregar
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;

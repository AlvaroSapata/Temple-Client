import { useEffect, useState } from "react";
import { editProductService } from "../../services/products.services";

import { uploadImageService } from "../../services/upload.services";
import { Navigate } from "react-router";

function EditProductForm(props) {
  const { eachProduct,getData,setIsEditing } = props;
  // const params = useParams();
  // console.log(params)

  const [name, setName] = useState(eachProduct.name);
  const [price, setPrice] = useState(eachProduct.price);
  const [description, setDescription] = useState(eachProduct.description);
  const [image, setImage] = useState(eachProduct.image);
  const [showMessage, setShowMessage] = useState(false);

  const [imageUrl, setImageUrl] = useState(null); 
const [isUploading, setIsUploading] = useState(false);

  const handleNameChange = (e) => setName(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = {
        name,
        price,
        description,
        image: imageUrl
      };
      await editProductService(eachProduct._id, updatedProduct);
      setShowMessage(true);
      // console.log("producto actualizado");
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
      Navigate("/error");
    }
  };

  // Timer que hace que el mensaje de producto actualizado se muestre
  useEffect(() => {
    // invocamos getData para que el producto este actualizado al dar la vuelta
    getData();
    
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
        setIsEditing(false)
      };
    }
  }, [showMessage]);



  return (
    <div className="myBackCard">
      <p className="title">{eachProduct.name}</p>
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
        <label htmlFor="price">Precio</label>
        <input
          type="number"
          name="price"
          id="price"
          value={price}
          onChange={handlePriceChange}
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
{imageUrl ? (<div><img src={imageUrl} alt="img" width={200} /></div>) : null}
        <br />
        <button className="myButtons"  style={{ width: "80%", marginLeft: "10%", marginRight:"10%"}}>Aceptar cambios</button>
        <br />
        <div>
          {/* HACER QUE NO MUEVA TODO */}
          {showMessage && <p>Actualizado !</p>}
        </div>
      </form>
    </div>
  );
}

export default EditProductForm;

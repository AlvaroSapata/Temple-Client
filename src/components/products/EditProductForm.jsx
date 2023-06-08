import { useEffect, useState } from "react";
import {
  editProductService,
  deleteProductService,
} from "../../services/products.services";

import { uploadImageService } from "../../services/upload.services";
import { useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

function EditProductForm(props) {
  const { eachProduct, getData, setIsEditing, isEditing } = props;
  const navigate = useNavigate();

  const [name, setName] = useState(eachProduct.name);
  const [price, setPrice] = useState(eachProduct.price);
  const [description, setDescription] = useState(eachProduct.description);
  const [image, setImage] = useState(eachProduct.image);
  const [showMessage, setShowMessage] = useState(false);

  const [imageUrl, setImageUrl] = useState(eachProduct.image);
  const [isUploading, setIsUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedProduct = {
        name,
        price,
        description,
        image: imageUrl,
      };
      await editProductService(eachProduct._id, updatedProduct);
      setShowMessage(true);
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
      if (error.response.status === 400) {
        setErrorMessage("Archivo demasiado grande");
        setIsLoading(false);
        setIsUploading(false);
      }     }
  };
  // Elimina un Producto por su ID
  const deleteProduct = async (id) => {
    try {
      await deleteProductService(id);
      // Actualizamos los datos después de la eliminación
      getData();
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
  };
  useEffect(() => {
    getData();

    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
        setIsEditing(false);
      };
    }
  }, [showMessage]);

  return (
    <div className="myBackCard">
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
        </div>

        {isUploading ? <ScaleLoader color={"#471971"} loading={true} /> : null}

        {/* {imageUrl ? (
          <div>
            <img src={imageUrl} alt="img" width={200} />
          </div>
        ) : null} */}
        <br />
        {isEditing ? (
          <div className="botonesprodictos">
            <button className="myButtons" disabled={isLoading}>
              Aceptar
            </button>
            <button
              onClick={() => deleteProduct(eachProduct._id)}
              className="myButtons"
              disabled={isLoading}
            >
              eliminar
            </button>
          </div>
        ) : null}
        {errorMessage && <p style={{ color: "lightred" }}>{errorMessage}</p>}

        <br />
        <div>
          {/* HACER QUE NO MUEVA TODO */}
          {/*           {showMessage && <p style={{ color: "red" }}>Actualizado !</p>} */}
        </div>
      </form>
    </div>
  );
}

export default EditProductForm;

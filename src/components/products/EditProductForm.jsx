import { useEffect, useState } from "react";
import { editProductService } from "../../services/products.services";

function EditProductForm(props) {
  const { eachProduct,getData,setIsEditing } = props;
  // const params = useParams();
  // console.log(params)

  const [name, setName] = useState(eachProduct.name);
  const [price, setPrice] = useState(eachProduct.price);
  const [description, setDescription] = useState(eachProduct.description);
  const [image, setImage] = useState(eachProduct.image);
  const [showMessage, setShowMessage] = useState(false);

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
        image,
      };
      await editProductService(eachProduct._id, updatedProduct);
      setShowMessage(true);
      console.log("producto actualizado");
    } catch (error) {
      console.log(error);
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
        <label htmlFor="image">Imagen</label>
        <input
          type="text"
          name="image"
          id="image"
          value={image}
          onChange={handleImageChange}
        />
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

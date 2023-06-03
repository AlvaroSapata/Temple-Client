import { useState } from "react";
import { createLocationService } from "../../services/locations.services";

function AddLocationForm(props) {
    console.log(props.setIsLoading);
    console.log(props.getData);
  
    // Destructurar props
    const { setIsLoading, getData, toggleForm } = props;
  
    // Estados para registrar los cambios
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [adress, setAdress] = useState([]);
    const [description, setDescription] = useState("");
  
    const handleNameChange = (e) => setName(e.target.value);
    const handleImageChange = (e) => setImage(e.target.value);
    const handleAdressChange = (e) => setAdress(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("apretando el boton");
      setIsLoading(true);
      toggleForm();
  
      try {
        const newLocation = {
          name,
          image,
          adress,
          description,
        };
        await createLocationService(newLocation);
        getData();
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <div className="myLocationFormContainer">
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
          <label htmlFor="image">image</label>
          <input
            type="text"
            name="image"
            onChange={handleImageChange}
            value={image}
          />
          <br />
          <label htmlFor="adress">adress</label>
          <input
            type="text"
            name="adress"
            onChange={handleAdressChange}
            value={adress}
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
          <button className="myButtons" type="submit">Agregar</button>
        </form>
      </div>
    );
}

export default AddLocationForm
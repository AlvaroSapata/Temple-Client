import { useEffect, useState } from "react";
import { editLocationService } from "../../services/locations.services";
import { useNavigate } from "react-router-dom";

function EditLocationForm(props) {
  const { locationDetails, getData } = props;

  const navigate = useNavigate();

  const [name, setName] = useState(locationDetails.name);
  const [description, setDescription] = useState(locationDetails.description);
  const [image, setImage] = useState(locationDetails.image);
  const [adress, setAdress] = useState(locationDetails.adress);


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
        image,
      };
      await editLocationService(locationDetails._id, updatedProduct);
      console.log("Ubicacion actualizada");
      navigate("/locations");
    } catch (error) {
      console.log(error);
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
        <label htmlFor="image">Imagen</label>
        <input
          type="text"
          name="image"
          id="image"
          value={image}
          onChange={handleImageChange}
        />
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

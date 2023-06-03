import { useState } from "react";
import { createDjService } from "../../services/djs.services";

function AddDjForm(props) {
  console.log(props.setIsLoading);
  console.log(props.getData);

  // Destructurar props
  const { setIsLoading, getData, toggleForm } = props;

  // Estados para registrar los cambios
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleImageChange = (e) => setImage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("apretando el boton");
    setIsLoading(true);
    toggleForm();

    try {
      const newDj = {
        name,
        image,
      };
      await createDjService(newDj);
      getData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="myDjFormContainer">
      <h3>Añadir Dj</h3>

      <form onSubmit={handleSubmit} className="myDjForm">
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
        <button className="myButtons" type="submit">Agregar</button>
      </form>
    </div>
  );
}
export default AddDjForm;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Djs() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
  // Estado principal
  const [djs, setDjs] = useState([]);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []); // CDM

  // Actualizamos los estados
  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/djs`
      );
      console.log(response);
      setDjs(response.data);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
  };

  // Clausula de loading
  if (isLoading) {
    return <h3>Cargando...</h3>;
  }

  return (
    <div>
      <h3>Nuestros Djs</h3>

      {djs.map((eachDj) => {
        return (
          <div key={eachDj._id}>
            <img src={eachDj.image} alt="eachDj" width={"300px"} />
            <p>{eachDj.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Djs;

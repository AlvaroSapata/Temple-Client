import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddDjForm from "../../components/djs/AddDjForm";
import { deleteDjService, getAllDjsService } from "../../services/djs.services";
import ScaleLoader from "react-spinners/ScaleLoader";
import { AuthContext } from "../../context/auth.context.js";
import Card from "react-bootstrap/Card";

function Djs() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
  // Destructuracion
  const { isAdmin } = useContext(AuthContext);
  // Estado principal
  const [djs, setDjs] = useState([]);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []); // CDM

  // Actualizamos los estados
  const getData = async () => {
    try {
      const response = await getAllDjsService();
      // console.log(response);
      setDjs(response.data);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
  };

  // Elimina un DJ por su ID
  const deleteDj = async (id) => {
    try {
      await deleteDjService(id);
      // Actualizamos los datos después de la eliminación
      getData();
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
  };

  // Muestra/esconde el formulario
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Clausula de loading
  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div className="DjsPage">
      {isAdmin ? (
        <button className="myButtons" onClick={toggleForm}>
          Añadir Dj
        </button>
      ) : null}
      <h3>Nuestros Djs</h3>
      {isFormVisible ? (
        <AddDjForm
          getData={getData}
          setIsLoading={setIsLoading}
          toggleForm={toggleForm}
        />
      ) : null}
      <div className="myEventsList">
        {djs.map((eachDj) => {
          return (
            <div key={eachDj._id} >
            <div className="mainIGborder">
                      <span>- {eachDj.name} -</span>
                    </div>
                    <br />
              <div >
                <div className="cardIGborder">
                  <div className="imageIGborder">
                    <img src={eachDj.image} alt="eachDj" />
                  </div>
                  <div className="textIGborder">
                   
                    <div className="subIGborder">
                      <span>@{eachDj.name}</span>
                    </div>
                  </div>
                </div>
                <br/>
                {isAdmin ? (
                  <button
                    className="myButtons"
                    onClick={() => deleteDj(eachDj._id)}
                  >
                    eliminar
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Djs;

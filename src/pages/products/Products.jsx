import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddProductForm from "../../components/products/AddProductForm";
import { deleteProductService } from "../../services/products.services";
import EditProductForm from "../../components/products/EditProductForm";

function Products() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
  // Estado principal
  const [products, setProducts] = useState([]);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);
  // Estado visivilidad formulario
  const [isFormVisible, setIsFormVisible] = useState(false);
  // Estado para editar el producto
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getData();
  }, []); // CDM

  // Actualizamos los estados
  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/products`
      );
      console.log(response);
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      navigate("/error");
      console.log(error);
    }
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

  // Muestra/esconde el formulario
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Da la vuelta al producto
  const flipProduct = () => {
    console.log(isEditing)
    setIsEditing(true);
  }

  // Clausula de loading
  if (isLoading) {
    return <h3>Cargando...</h3>;
  }

  return (
    <div>
      <h3>Nuestros Productos</h3>
      <button onClick={toggleForm}>Añadir Producto</button> {/* Solo Admin */}
      <button className="myEditProductBtn" onClick={flipProduct}>Editar Productos</button>

      {isFormVisible ? (
        <AddProductForm
          getData={getData}
          setIsLoading={setIsLoading}
          toggleForm={toggleForm}
        />
      ) : null}

      {products.map((eachProduct) => {
        return (
          <div key={eachProduct._id} className="productContainer">
          <div className={isEditing ? "flip-card editing" : "flip-card"}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img
                    src={eachProduct.image}
                    alt="eachProduct"
                    width={"300px"}
                  />
                  <p className="title">{eachProduct.name}</p>
                  <div className="myPriceAndIcon"><p>{eachProduct.price}€</p><button><img src="images/add-cart.png" alt="add" /></button></div>
                  
                </div>
                <div className="flip-card-back">
                <EditProductForm eachProduct={eachProduct} getData={getData} setIsEditing={setIsEditing}/>
                </div>
              </div>
            </div>
            <button className="myEditProductBtn" onClick={flipProduct}>Editar</button>

            <button onClick={() => deleteProduct(eachProduct._id)}>
              eliminar
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Products;



import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Products() {
  // Navegar a distintas rutas despues de una accion
  const navigate = useNavigate();
  // Estado principal
  const [products, setProducts] = useState([]);
  // Estado de loading
  const [isLoading, setIsLoading] = useState(true);

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

  // Clausula de loading
  if (isLoading) {
    return <h3>Cargando...</h3>;
  }

  return (
    <div>
      <h3>Nuestros Productos</h3>

      {products.map((eachProduct) => {
        return (
          <div key={eachProduct._id}>
            <img src={eachProduct.image} alt="eachProduct" width={"300px"} />
            <p>{eachProduct.name}</p>
            <p>{eachProduct.price}€</p>
            <button>Añadir al carrito</button>
          </div>
        );
      })}
    </div>
  );
}

export default Products
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddProductForm from "../../components/products/AddProductForm";
import {
  deleteProductService,
  getAllProductsService,
} from "../../services/products.services";
import EditProductForm from "../../components/products/EditProductForm";
import ScaleLoader from "react-spinners/ScaleLoader";
import { AuthContext } from "../../context/auth.context.js";
import PaymentIntent from "../../components/pagos/PaymentIntent";
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
  // Estado pagos individuales
  const [productIdToBuy, setProductIdToBuy] = useState();

  // Destructuracion
  const { isAdmin } = useContext(AuthContext);

  const [showPaymentIntent, setShowPaymentIntent] = useState(false);

  useEffect(() => {
    getData();
  }, []); // CDM

  // Actualizamos los estados
  const getData = async () => {
    try {
      const response = await getAllProductsService();
      // console.log(response);
      setProducts(response.data);
      setIsLoading(false);
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
    // console.log(isEditing)
    setIsEditing(true);
  };

  // Clausula de loading
  if (isLoading) {
    return <ScaleLoader color="#471971" className="myLoader" />;
  }

  return (
    <div className="myProductsPage">
      <h3>Nuestros Productos</h3>
      <div className="productButtons">
        <div>
          {isAdmin ? (
            <button className="myButtons" onClick={toggleForm}>
              Añadir Producto
            </button>
          ) : null}
        </div>
        <div>
          {isAdmin ? (
            <button className="myButtons" onClick={flipProduct}>
              Editar Productos
            </button>
          ) : null}
        </div>
      </div>

      {isFormVisible ? (
        <AddProductForm
          getData={getData}
          setIsLoading={setIsLoading}
          toggleForm={toggleForm}
        />
      ) : null}

      <div className="myProductsList">
        {products.map((eachProduct) => {
          return (
            <div key={eachProduct._id} className="productContainer">
              <div className={isEditing ? "flip-card editing" : "flip-card"}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div
                      className="myPrductImgContainer"
                      style={{ maxWidth: "100%", maxHeight: "60%" }}
                    >
                      <img
                        className="myProductImg"
                        src={eachProduct.image}
                        alt="eachProduct"
                      />
                    </div>
                    <p className="title">{eachProduct.name}</p>
                    <div>{eachProduct.description}</div>
                    <div className="myPriceAndIcon">
                      <p>{eachProduct.price}€</p>
                      <div>
                        {productIdToBuy != eachProduct._id ? (
                          <img
                            src="images/icons8-buy-64.png"
                            alt="add"
                            onClick={() => setProductIdToBuy(eachProduct._id)}
                          />
                        ) : (
                          <img
                            src="images/icons8-thank-you-64.png"
                            alt="add"
                            onClick={() => setProductIdToBuy(eachProduct._id)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <EditProductForm
                      eachProduct={eachProduct}
                      getData={getData}
                      setIsEditing={setIsEditing}
                      isEditing={isEditing}
                    />
                  </div>
                </div>
              </div>
              <div>
                {productIdToBuy != eachProduct._id ? null : (
                  <PaymentIntent productDetails={eachProduct} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Products;

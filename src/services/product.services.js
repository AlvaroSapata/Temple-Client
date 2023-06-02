import service from "./config.services";

const getAllProductsService = () => {
  return service.get("/products");
};

const createProductService = (newProduct) => {
  return service.post("/products", newProduct);
};

const deleteProductService = (productId) => {
  return service.delete(`/products/${productId}`);
};

const editProductService = (productId, updatedProduct) => {
  return service.put(`/products/${productId}`, updatedProduct);
};

export {
  getAllProductsService,
  createProductService,
  deleteProductService,
  editProductService,
};

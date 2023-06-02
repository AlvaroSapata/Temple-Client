import service from "./config.services";

const getAllDjsService = () => {
  return service.get("/djs");
};

const createDjService = (newDj) => {
  return service.post("/djs", newDj);
};

const deleteDjService = (djId) => {
  return service.delete(`/djs/${djId}`);
};


export {
    getAllDjsService,
    createDjService,
    deleteDjService,
};
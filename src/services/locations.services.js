import service from "./config.services";

const getAllLocationsService = () => {
  return service.get("/locations");
};

const createLocationService = (newLocation) => {
  return service.post("/locations", newLocation);
};

const getLocationDetailsService = (locationId) => {
  return service.get(`/locations/${locationId}`);
};

const deleteLocationService = (locationId) => {
  return service.delete(`/locations/${locationId}`);
};

const editLocationService = (locationId, updatedLocation) => {
  return service.put(`/locations/${locationId}`, updatedLocation);
};

export {
  getAllLocationsService,
  createLocationService,
  getLocationDetailsService,
  deleteLocationService,
  editLocationService,
};

import service from "./config.services";

const getAllEventsService = () => {
  return service.get("/events");
};

const createEventService = (newEvent) => {
  return service.post("/events", newEvent);
};

const getEventsDetailsService = (eventId) => {
  return service.get(`/events/${eventId}`);
};

const deleteEventsService = (eventId) => {
  return service.delete(`/events/${eventId}`);
};

const editEventsService = (eventId, updatedEvent) => {
  return service.put(`/events/${eventId}`, updatedEvent);
};

const joinService = (eventId, updatedEvent) => {
  return service.put(`/events/${eventId}/join`, updatedEvent);
};

const unJoinService = (eventId, updatedEvent) => {
  return service.put(`/events/${eventId}/unjoin`, updatedEvent);
}



export {
  getAllEventsService,
  createEventService,
  getEventsDetailsService,
  deleteEventsService,
  editEventsService,
  joinService,
  unJoinService
};

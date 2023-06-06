import service from "./config.services";

const uploadImageService = (imageFile) => {
  return service.post("/upload/image", imageFile);
};

const uploadVideoService =(videoFile) => {
  return service.post("/upload/video", videoFile);
};

export { uploadImageService,uploadVideoService };
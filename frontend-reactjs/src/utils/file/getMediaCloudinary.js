import cloudinary, { cloudinaryConfig } from "../../configs/CloudinaryConfig";
import { MediaType } from "../../features/medias/constants/mediaType";

export function getMediaCloudinary(publicID, mediaType=MediaType.IMAGE.value) {
    return mediaType === MediaType.VIDEO.value ? cloudinaryConfig.video(publicID) : cloudinaryConfig.image(publicID);
}

// const url = cloudinary.url('recipes/20250810200859_2f929b1b', {
//   resource_type: 'image',
//   version: '1754831341',
//   format: 'jpg',
//   transformation: { width: 300, height: 300, crop: 'fill' }
// });
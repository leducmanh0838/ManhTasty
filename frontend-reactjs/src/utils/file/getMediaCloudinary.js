import cloudinary, { cloudinaryConfig } from "../../configs/CloudinaryConfig";
import { MediaType } from "../../features/medias/constants/mediaType";

export function getMediaCloudinary(publicID, mediaType=MediaType.IMAGE.value) {
    if(!publicID) return null;
    if(mediaType === MediaType.VIDEO.value && publicID.startsWith('video/upload/'))
        publicID=publicID.replace('video/upload/', '')
    if(mediaType === MediaType.IMAGE.value && publicID.startsWith('image/upload/'))
        publicID=publicID.replace('image/upload/', '')

    return mediaType === MediaType.VIDEO.value ? cloudinaryConfig.video(publicID).toURL() : cloudinaryConfig.image(publicID).toURL();
}

// const url = cloudinary.url('recipes/20250810200859_2f929b1b', {
//   resource_type: 'image',
//   version: '1754831341',
//   format: 'jpg',
//   transformation: { width: 300, height: 300, crop: 'fill' }
// });
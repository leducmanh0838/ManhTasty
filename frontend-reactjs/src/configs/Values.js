export const WEB_CLIENT_ID = process.env.REACT_APP_WEB_CLIENT_ID;
export const FACEBOOK_APP_ID= process.env.REACT_APP_FACEBOOK_APP_ID;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const DOT_CLIENT_ID = process.env.REACT_APP_DOT_CLIENT_ID;
export const DOT_CLIENT_SECRET = process.env.REACT_APP_DOT_CLIENT_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

export const ModelContentType = Object.freeze({
  RECIPE: { value: 7, label: "Món ăn"},
  COMMENT: { value: 14, label: "Bình luận"},
});

// Nếu muốn mảng để dễ .map() khi render
export const ModelContentTypeList = Object.values(ModelContentType);
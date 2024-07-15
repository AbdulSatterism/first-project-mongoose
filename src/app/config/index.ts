import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BYCRYPT_SALT_ROUND,
  default_password: process.env.DEFAULT_PASSWORD,
  jwt_access_token: process.env.JWT_ACCESS_TOKEN,
  jwt_refresh_token: process.env.JWT_REFRESH_TOKEN,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_image_cloud_name: process.env.CLOUDINARY_IMAGE_CLOUD_NAME,
  cloudinary_image_api_key: process.env.CLOUDINARY_IMAGE_API_KEY,
  cloudinary_image_api_secret: process.env.CLOUDINARY_IMAGE_API_SECRET,
  super_admin_pass: process.env.SUPER_ADMIN_PASS,
};

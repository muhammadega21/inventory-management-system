import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Failed to upload image"));
        resolve(result.secure_url);
      },
    );
    uploadStream.end(fileBuffer);
  });
};

export const extractPublicId = (url: string): string | null => {
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\./);
  return matches ? matches[1] : null;
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    const publicId = extractPublicId(imageUrl);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Error deleting image from cloudinary", error);
  }
};

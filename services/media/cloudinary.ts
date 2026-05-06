// services/media/cloudinary.ts
import axios from "axios";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

const cloudinaryService = {
  async uploadPetTempImage(file: File): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
    );
    formData.append("folder", "temp/pets");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await axios.post<CloudinaryUploadResponse>(url, formData);
    return res.data;
  },
};

export default cloudinaryService;

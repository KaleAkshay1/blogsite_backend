import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dvdpcmpng",
  api_key: 614731885758592,
  api_secret: "ebzK3GFApB3HXaye3kMtUhPjLFI",
});

const uplodeOnCloudinary = async (path, folder) => {
  try {
    if (!path || !folder) return null;
    const responce = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
      folder: `Blog/${folder}`,
    });
    fs.unlinkSync(path);
    return responce.url;
  } catch (error) {
    console.log("cloudinary error when uplode", error.message);
    return null;
  }
};

const deleteFromCloudinary = async (path = "") => {
  try {
    if (!path) return null;
    const pathArr = path.split("Blog/");
    if (pathArr.length !== 2) return null;

    const public_id = "Blog/" + pathArr[1].split(".")[0];
    const responce = await cloudinary.uploader.destroy(public_id);

    if (responce?.result === "not found") return null;
    return true;
  } catch (error) {
    console.log("cloudinary error when uplode", error.message);
    return null;
  }
};

export { uplodeOnCloudinary, deleteFromCloudinary };

import { nanoid } from "nanoid";
import {
  accessPostById,
  createPost,
  getPostsData,
  updateViewsOfPost,
} from "../services/db.services.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/async_handler.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";

const addPost = asyncHandler(async (req, res) => {
  const { category, des, title } = req.body;
  if (!category || !des || !title) {
    throw new apiError(
      200,
      category
        ? title
          ? "description require"
          : "title require"
        : "category require"
    );
  }
  const banner = await uplodeOnCloudinary(req.file?.path, "posts");
  if (!banner) {
    throw new apiError(400, "plz send banner again");
  }
  const obj = { id: nanoid(), des, title, category, user_id: req.user, banner };
  const responce = await createPost(obj);
  if (!responce) {
    throw new apiError(400, "Invalid data");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, responce ? true : false, "Blog created succesfully")
    );
});

const getImageLink = asyncHandler(async (req, res) => {
  if (Object.keys(req.file).length < 1) {
    throw new apiError(400, "Image require");
  }
  const responce = await uplodeOnCloudinary(req.file.path, "posts");
  if (!responce) {
    throw new apiError(400, "plz send image again");
  }
  res
    .status(200)
    .json(new ApiResponse(200, responce, "image uploded succesfully"));
});

const getPosts = asyncHandler(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const { category = null } = req.params;
  const responce = await getPostsData(Number(limit), Number(page), category);
  if (responce?.length < 1) {
    throw new apiError(400, "No data Found");
  }
  res.status(200).json(new ApiResponse(200, responce));
});

const getSingelPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await accessPostById(id);
  if (blog.length < 1 || !blog) {
    throw new apiError(400, "Invalid id");
  }
  const updatedView = await updateViewsOfPost(id);
  if (!updatedView) {
    throw new apiError(500, "views not updated");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { ...blog[0], views: blog[0].views + 1 }, ""));
});

export { addPost, getImageLink, getPosts, getSingelPost };

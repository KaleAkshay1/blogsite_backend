import { nanoid } from "nanoid";
import {
  accessPostById,
  createPost,
  getAllCategories,
  getPostsData,
  insertRow,
  latestPost,
  randomPost,
  serchPostsResult,
  trendingPost,
  updateViewsOfPost,
} from "../services/db.services.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/async_handler.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";
import { dummy_data, hero } from "../utils/constant.js";

const addPost = asyncHandler(async (req, res) => {
  const { categoryId, des, title } = req.body;
  if (req.user?.role !== "admin") {
    throw new apiError(401, "Only Admin can create Blog");
  }
  if (!categoryId || !des || !title) {
    throw new apiError(
      200,
      categoryId
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
  const obj = {
    id: nanoid(),
    des,
    title,
    categoryId,
    user_id: req.user?.id,
    banner,
  };
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
  const { limit = process.env.LIMIT, page = 1 } = req.query;
  const { category = null } = req.params;
  const responce = await getPostsData(Number(limit), Number(page), category);
  if (responce?.length < 1) {
    throw new apiError(400, "No data Found");
  }
  res.status(200).json(new ApiResponse(200, responce));
});

const getTrendingPosts = asyncHandler(async (req, res) => {
  const { limit = process.env.LIMIT, page = 1 } = req.query;
  const { category = null } = req.params;
  const responce = await trendingPost(Number(limit), Number(page), category);
  if (responce?.length < 1) {
    throw new apiError(400, "No data Found");
  }
  res.status(200).json(new ApiResponse(200, responce));
});

const getLatestPosts = asyncHandler(async (req, res) => {
  const { limit = process.env.LIMIT, page = 1 } = req.query;
  const { category = null } = req.params;
  const responce = await latestPost(Number(limit), Number(page), category);
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

const getCategorys = asyncHandler(async (req, res) => {
  const responce = await getAllCategories();
  res.status(200).json(new ApiResponse(200, responce));
});

const getHomePageData = asyncHandler(async (req, res) => {
  const responce = { hero, dummy_data };
  const trending = await trendingPost();
  const latest = await latestPost();
  const random = await randomPost();
  responce.trending = trending;
  responce.latest = latest;
  responce.random = random;
  res.status(200).json(new ApiResponse(200, responce));
});

const searchBlogs = asyncHandler(async (req, res) => {
  const { query, limit = process.env.LIMIT, page = 1 } = req.query;
  if (!query) {
    throw new apiError(400, "serch text cannot be empty");
  }
  const result = await serchPostsResult(query, Number(limit), Number(page));
  res.status(200).json(new ApiResponse(200, result));
});

const addCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;
  const image = req.file;
  const responce = await uplodeOnCloudinary(image.path, "categorys");
  const data = await insertRow({ image: responce, category }, "categorys");
  res.send("ok");
});

export {
  addPost,
  getImageLink,
  getPosts,
  getSingelPost,
  addCategory,
  getCategorys,
  getHomePageData,
  searchBlogs,
  getTrendingPosts,
  getLatestPosts,
};

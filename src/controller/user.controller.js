import asyncHandler from "../utils/async_handler.js";
import apiError from "../utils/apiError.js";
import ApiResponce from "../utils/apiResponse.js";
import {
  accessById,
  deletePost,
  updateUser,
  userPosts,
} from "../services/db.services.js";
import {
  deleteFromCloudinary,
  uplodeOnCloudinary,
} from "../utils/cloudinary.js";

const updateProfileImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exist = await accessById("users", id);
  if (exist.length < 1) {
    throw new apiError(401, "Invalid Id");
  }
  const { socialLink } = req.body;
  const profile_picture = req.file;
  if (!profile_picture && (!socialLink || Object.keys(socialLink).length < 1)) {
    throw new apiError(400, " profile_picture or socialLink require");
  }
  let responce;
  if (profile_picture && socialLink) {
    const url = await uplodeOnCloudinary(profile_picture.path, "user");
    if (!url) {
      throw new apiError(400, "Image not found plz uplode again");
    } else if (
      exist[0].profile_picture !==
      "http://res.cloudinary.com/dvdpcmpng/image/upload/v1734678335/Blog/user/anwk9cdjrhmvqhqsue07.jpg"
    ) {
      const delet = await deleteFromCloudinary(exist[0].profile_picture);
      responce = await updateUser(id, {
        profile_picture: url,
        socialLink: JSON.stringify(socialLink),
      });
    } else {
      responce = await updateUser(id, {
        profile_picture: url,
        socialLink: JSON.stringify(socialLink),
      });
    }
  } else if (profile_picture) {
    const url = await uplodeOnCloudinary(profile_picture.path, "user");
    if (!url) {
      throw new apiError(400, "Image not found plz uplode again");
    } else if (
      exist[0].profile_picture !==
      "http://res.cloudinary.com/dvdpcmpng/image/upload/v1734678335/Blog/user/anwk9cdjrhmvqhqsue07.jpg"
    ) {
      const delet = await deleteFromCloudinary(exist[0].profile_picture);
      responce = await updateUser(id, { profile_picture: url });
    } else {
      responce = await updateUser(id, { profile_picture: url });
    }
  } else {
    responce = await updateUser(id, { socialLink: JSON.stringify(socialLink) });
  }
  if (!responce) {
    throw new apiError(400, "user profile is not updated");
  }
  res
    .status(200)
    .json(new ApiResponce(200, responce, "Profile Update Successfully"));
});

const myPosts = asyncHandler(async (req, res) => {
  const { limit = process.env.LIMIT, page = 1 } = req.query;
  const { user_id } = req.params;
  const user = req.user;
  if (user_id !== user.id) {
    throw new apiError(401, "Invalid User ID");
  }

  const responce = await userPosts(user_id, Number(limit), Number(page));
  res.status(200).json(new ApiResponce(200, responce));
});

const deletePostsByUser = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const user = req.user;
  const postExist = await accessById("posts", post_id);
  if (postExist.length === 0) {
    throw new apiError(404, "Invalid post id");
  }
  if (user.id !== postExist[0].user_id) {
    throw new apiError(401, "you are not owner of this post");
  }
  const responce = await deletePost(postExist[0].id);
  if (!responce) {
    throw new apiError(404, "Post not deleted plz try again");
  }
  res.status(200).json(new ApiResponce(200, responce ? true : false));
});

export { updateProfileImage, myPosts, deletePostsByUser };

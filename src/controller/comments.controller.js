import {
  accessById,
  deleteCommentDb,
  getCommentsOfPost,
  insertRow,
} from "../services/db.services.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/async_handler.js";
import { nanoid } from "nanoid";
import ApiResponce from "../utils/apiResponse.js";

const addComment = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const { comment } = req.body;
  if (!comment) {
    throw new apiError(400, "Comment Require");
  }
  const exist = await accessById("posts", post_id);
  if (!exist.length) {
    throw new apiError(400, "Invalid Id of Blog");
  }
  const obj = { id: nanoid(), user_id: req.user?.id, post_id, comment };
  const responce = await insertRow(obj, "comments");
  if (!responce) {
    throw new apiError(400, "Comment not Created");
  }
  res
    .status(200)
    .json(new ApiResponce(200, responce, "Comment created Succesfully"));
});

const getAllCommentOfPost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const exist = await accessById("posts", post_id);
  if (!exist.length) {
    throw new apiError(400, "Invalid Id of Blog");
  }
  const responce = await getCommentsOfPost(post_id);
  const parent = responce[0].filter(
    (ele, ind) => ele.parent_comment_id === null
  );
  const child = responce[0].filter((ele) => ele.parent_comment_id !== null);
  const data = parent.map((ele, ind) => {
    const obj = {
      P_id: ele.user_id,
      P_name: ele.username,
      P_emial: ele.email,
      P_profile_picture: ele.profile_picture,
      P_comment_id: ele.id,
      P_comment: ele.comment,
      P_created_at: ele.created_at,
    };
    const reply = child.filter((item) => ele.id === item.parent_comment_id);
    obj["Reply"] = reply;
    return obj;
  });
  res.status(200).json(new ApiResponce(200, data));
});

const replayToComment = asyncHandler(async (req, res) => {
  const { post_id, comment_id } = req.params;
  const { reply } = req.body;
  if (!reply) {
    throw new apiError(400, "Reply Require");
  }
  const postExist = await accessById("posts", post_id);
  if (!postExist.length) {
    throw new apiError(400, "Invalid Id of Blog");
  }
  const CommentExist = await accessById("comments", comment_id);
  if (!CommentExist.length) {
    throw new apiError(400, "Invalid comment Id ");
  }
  const obj = {
    id: nanoid(),
    user_id: req.user?.id,
    post_id,
    comment: reply,
    parent_comment_id: comment_id,
  };
  const responce = await insertRow(obj, "comments");
  if (!responce) {
    throw new apiError(400, "reply fail to add");
  }
  res
    .status(200)
    .json(new ApiResponce(200, responce, "Succesfully add responce"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.params;
  const user = req.user;
  const comment = await accessById("comments", comment_id);
  if (comment.length === 0) {
    throw new apiError(404, "Invalid comment Id");
  }
  const post = await accessById("posts", comment[0].post_id);
  if (post.length === 0) {
    throw new apiError(404, "Invalid Post ID");
  }
  if (
    user.id !== comment[0].user_id &&
    comment[0].user_id !== post[0].user_id
  ) {
    throw new apiError(401, "You are No rigts to delete this comment");
  }
  console.log(comment_id, req.params);
  const responce = await deleteCommentDb(comment_id);

  if (!responce) {
    throw new apiError(404, "Comment not deleted plz try again");
  }
  res.status(200).json(new ApiResponce(200, responce ? true : false));
});

export { addComment, getAllCommentOfPost, replayToComment, deleteComment };

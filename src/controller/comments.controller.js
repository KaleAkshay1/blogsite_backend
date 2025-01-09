import { accessById, insertRow } from "../services/db.services.js";
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
  const obj = { id: nanoid(), user_id: req.user, post_id, comment };
  const responce = await insertRow(obj, "comments");
  if (!responce) {
    throw new apiError(400, "Comment not Created");
  }
  res
    .status(200)
    .json(new ApiResponce(200, responce, "Comment created Succesfully"));
});

export { addComment };

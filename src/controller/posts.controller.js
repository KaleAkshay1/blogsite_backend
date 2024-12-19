import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/async_handler.js";

const addPost = asyncHandler((req, res) => {
  console.log("askdfa");
  res.cookie("name", "cj");
  res.status(200).json(
    new ApiResponse(200, {
      name: "ak",
      fileName: `${req.files[0].filename}`,
    })
  );
});

export { addPost };

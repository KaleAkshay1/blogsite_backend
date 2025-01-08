import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/async_handler.js";

const addPost = asyncHandler((req, res) => {
  const { category, context, description, title } = req.body;
  if (!description || !context || !title || !category) {
    throw new apiError(
      200,
      category
        ? title
          ? context?.length
            ? "description require"
            : "context require"
          : "title require"
        : "category require"
    );
  }
  const obj = { description, context, title, category };
  req.files.forEach((ele, index) => {
    const query = fieldname.match(/([^\[\]]+)/g);
    const newquery = query.map((item) => (isNaN(item) ? item : Number(item)));
    console.log(newquery);
    if (
      ele.fieldname != "banner" &&
      ele.fieldname == `context[${index}][image]`
    ) {
      obj.context[index] = ele.filename;
    }
  });
  console.log(obj);
  res.status(200).json(new ApiResponse(200, obj, "Blog created succesfully"));
});

export { addPost };

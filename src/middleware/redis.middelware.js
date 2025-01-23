import asyncHandler from "../utils/async_handler.js";
import ApiResponse from "../utils/apiResponse.js";
import { redis } from "../config/redis.connection.js";

const checkCasheofBlog = (type = null) => {
  return async (req, res, next) => {
    try {
      const val = "blog";
      const page = req.query.page || 1;
      const category = req.params.category || null;
      const key =
        type === "categorys" || type === "home-page"
          ? `${val}:${type}`
          : category
          ? type
            ? `${val}:${category}:${type}:${page}`
            : `${val}:${category}:${page}`
          : type
          ? `${val}:${type}:${page}`
          : `${val}:${page}`;

      const isExist = await redis.exists(key);
      if (isExist) {
        const data = await redis.get(key);
        console.log("cache responce");
        return res
          .status(200)
          .json(new ApiResponse(200, { data: JSON.parse(data) }));
      }

      next();
    } catch (error) {
      console.log("Cache check error:", error.message);
      next();
    }
  };
};

const delCacheOfBlog = async (val) => {
  const keys = await redis.keys("*");
  const filterdKeys = keys.filter((ele) => ele.startsWith(val));
  const result =
    filterdKeys.length > 0 ? await redis.del(...filterdKeys) : false;
  return result;
};

export { checkCasheofBlog, delCacheOfBlog };

const asyncHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      console.log("error is", error);
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default asyncHandler;

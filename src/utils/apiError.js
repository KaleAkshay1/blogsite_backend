class apiError extends Error {
  constructor(status = 500, message = "something is wrong", error = []) {
    super(message);
    this.message = message;
    this.status = status;
    this.error = error;
    this.success = false;
  }
}

export default apiError;

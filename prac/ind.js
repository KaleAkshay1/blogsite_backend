class apiResponse {
  constructor(status, data = [], message = "success") {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

const obj = new apiResponse(200, { data: "ak" }, "hellow");
console.log(obj);

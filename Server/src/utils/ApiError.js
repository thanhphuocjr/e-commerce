class ApiError extends Error {
  constructor(message, statusCode = 500, errors = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default ApiError;
// hoặc nếu bạn dùng commonjs:
// module.exports = ApiError;

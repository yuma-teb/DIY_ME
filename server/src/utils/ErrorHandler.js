class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // calling the message from the default error parent class
    this.statusCode = statusCode;
    // adding a bool field for testing if the error is an operational error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;

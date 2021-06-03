const sendErrorDev = (err, res) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status,
      message: err.message,
      stack: err.stack,
    },
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status,
      message: err.message,
    },
  });
};

const errorHandler = (err, req, res, next) => {
  err.status = err.status || 500;
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Handle Mongoose Expections and Rejections
const initUnhandledExceptions = () => {
  process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION!  Shutting down...");
    process.exit(1);
  });
};
module.exports = {
  errorHandler,
  asyncHandler,
  initUnhandledExceptions,
};

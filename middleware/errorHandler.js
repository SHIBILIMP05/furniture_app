const customerror = require("../middleware/myCustomError")
const MyCustomError =customerror.MyCustomError
const AnotherCustomError = customerror.AnotherCustomError

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Customize the response based on the error type
    if (err instanceof MyCustomError) {
      return res.status(400).json({ error: err.message });
    } else if (err instanceof AnotherCustomError) {
      return res.status(401).json({ error: err.message });
    }
  
    // Handle other types of errors
    res.status(500).json({ error: 'Something went wrong!' });
  };
  
  module.exports = errorHandler;
  
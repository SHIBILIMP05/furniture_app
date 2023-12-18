// Create a custom error class
class MyCustomError extends Error {
    constructor(message) {
      super(message);
      this.name = 'MyCustomError';
    }
  }

  class AnotherCustomError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AnotherCustomError';
    }
  }
  
  
  module.exports ={MyCustomError,AnotherCustomError} ;
  
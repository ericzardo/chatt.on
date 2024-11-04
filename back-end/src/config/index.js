const config = {
  development: {
    corsConfig: {
      origin: process.env.BASE_URL,
      transports: ["websocket", "polling"],
      allowedHeaders: ['Authorization', 'Content-Type'],
    },
    socketConfig: {
      cors: {
        origin: process.env.BASE_URL,
        credentials: true,
      }
    }
  },
  production: {
    corsConfig: {
      origin: process.env.BASE_URL,
      allowedHeaders: ['Authorization', 'Content-Type'],
    },
    socketConfig: {
      cors: {
        origin: process.env.BASE_URL,
        transports: ["websocket", "polling"],
        credentials: true,
      }
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
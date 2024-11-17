const config = {
  development: {
    corsConfig: {
      origin: process.env.BASE_URL,
      transports: ["websocket", "polling"],
      allowedHeaders: ['Authorization', 'Content-Type'],
    },
    socketConfig: {
      pingTimeout: 60000,
      transports: ['websocket'],
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
      pingTimeout: 60000,
      transports: ['websocket', 'polling'],
      cors: {
        origin: process.env.BASE_URL,
        credentials: true,
      }
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
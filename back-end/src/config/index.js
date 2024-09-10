const config = {
  development: {
    corsConfig: {
      origin: [ process.env.DEVELOPMENT_BASE_URL ], 
      credentials: true,
    },
    cookieConfig: {
      secret: process.env.JWT_SECRET,
      hook: "onRequest",
      parseOptions: {
        httpOnly: true,
        secure: false,
        sameSite: "Strict"
      }
    },
    socketConfig: {
      cors: {
        origin: process.env.DEVELOPMENT_BASE_URL,
        credentials: true,
      }
    }
  },
  production: {
    corsConfig: {
      origin: [ process.env.BASE_URL ],
      credentials: true,
    },
    cookieConfig: {
      secret: process.env.JWT_SECRET,
      hook: "onRequest",
      parseOptions: {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
      }
    },
    socketConfig: {
      cors: {
        origin: process.env.BASE_URL,
        credentials: true,
      }
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
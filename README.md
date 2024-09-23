# Chatt.on

## Index
- [About](#about)
- [Technologies](#technologies)
- [Installation](#installation)
- [Use](#use)
- [Contribution](#contribution)
- [License](#license)

## About

Chatt.on is a chat application that allows real-time communication between users. The application is divided into front-end and back-end:

- **Front-end**: Implemented with React and Tailwind CSS, it provides a modern and responsive interface.
- **Back-end**: Implemented with Fastify and Prisma, manages server logic and data persistence.

## Technologies

- **Front-end**: React, Tailwind CSS, Vite
- **Backend**: Fastify, Prisma, Socket.io
- **Database**: MySQL

## Installation

To run this project locally, follow the steps below. Ensure you are in the root directory of the project before proceeding to set up the front-end and back-end.

### Prerequisites

Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [MySQL](https://www.mysql.com/downloads/) (for database, if applicable)

### Setup

1. **Navigate to the root directory of the project:**

  ```bash
  cd path/to/chatt.on
  ```

2. **Setting up the Front-end:**

  ```bash
  cd front-end # Navigate to the front-end directory
  npm install # Install the dependencies
  npm run dev # Start the development server
  ```

3. **Setting up the Back-end:**

Before starting the back-end, you need to configure environment variables.

  1. **Create a *.env* file in the back-end directory:**

  ```bash
  cd back-end # Navigate to the back-end directory
  touch .env # Create .env file in root
  ```

  2. **Add the following configuration to the *.env* file:**

  Open the .env file in a text editor and add the following content:

  ```env
  # Environment mode
  NODE_ENV="development"

  # Database connection URL
  DATABASE_URL="mysql://root:password@localhost:3306/online_chat"

  # Server configuration
  PORT=1337

  # JWT secret for authentication
  JWT_SECRET="your_jwt_secret_here"

  # Base URL for the front-end
  BASE_URL="http://localhost:5173"
  DEVELOPMENT_BASE_URL="http://localhost:5173"

  # SMTP configuration for email sending
  SMTP_HOST="smtp.gmail.com"
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER="your_email@gmail.com"
  SMTP_PASS="your_app_password_here"

  # Cloudflare R2 configuration
  R2_ACCESS_KEY_ID="your_r2_access_key_id_here"
  R2_SECRET_ACCESS_KEY="your_r2_secret_access_key_here"
  R2_BUCKET_NAME="your_r2_bucket_name_here"
  R2_ACCOUNT_ID="your_r2_account_id_here"
  R2_ENDPOINT="your_r2_endpoint_here"
  R2_PUBLIC_ENDPOINT="your_r2_public_endpoint_here"
  ```

  **Note**: 
  + Replace placeholder values with your own configuration. For example, generate an app password for Gmail if using Gmail SMTP.
  + For Cloudflare R2, make sure to add your own R2 configuration from your Cloudflare account

  3. **Install dependencies, run migrations, and start the server:**

  ```bash
  npm install # Install the dependencies
  npx prisma migrate dev # Create or update database tables
  npm run dev # Start the development server
  ```
#### Configuration Notes

- **Environment Variables:** The .env file is crucial for configuring different parts of your application. Ensure that values such as PORT, BASE_URL, and DATABASE_URL match between the front-end and back-end to ensure proper communication.
- **Port Matching:** If you change the port in the back-end (PORT), make sure to update the BASE_URL in the front-end configuration if needed.
- **SMTP Configuration:** For email functionality, configure SMTP settings according to your email service provider. For Gmail, you may need to generate an app-specific password.
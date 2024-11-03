# Chatt.on

## Index
- [About](#about)
- [Technologies](#technologies)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setting up the Front-end](#setting-up-the-front-end)
  - [Setting up the Back-end](#setting-up-the-back-end)
  - [Production Environment](#production-environment)
- [Configuration Notes](#configuration-notes)
- [Contribution](#contribution)
- [License](#license)

## About
Chatt.on is a chat application that allows real-time communication between users. The application is divided into front-end and back-end:

- **Front-end**: Implemented with React and Tailwind CSS, it provides a modern and responsive interface.
- **Back-end**: Implemented with Fastify and Prisma, it manages server logic and data persistence.

## Technologies
- **Front-end**: React, Tailwind CSS, Vite
- **Back-end**: Fastify, Prisma, Socket.io
- **Database**: MySQL

## Installation
To run this project locally, follow the steps below. Ensure you are in the root directory of the project before proceeding to set up the front-end and back-end.

### Prerequisites
Before setting up the project, make sure you have the following installed:

- Node.js (version 18 or later recommended)
- npm (comes with Node.js)
- MySQL (for the database, if applicable)

### Setting up the Front-end
1. **Navigate to the front-end directory**:
  ```bash
  cd path/to/chatt.on
  ```

2. **Create a .env file**:
   ```bash
   touch .env
   ```

3. **Add the following configuration to the *.env* file**:
   ```env
   VITE_NODE_ENV="development"

   VITE_API_BASE_URL=http://localhost:1337
   ```

4. **Run local server**:


   ```env
   npm install
   npm run dev
   ```

### Setting up the Back-end

1. **Create a *.env* file in the back-end directory:**

  ```bash
  cd back-end # Navigate to the back-end directory
  touch .env # Create .env file in root
  ```

2. **Add the following configuration to the *.env* file:**

  Open the `.env` file in a text editor and add the following content:

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


### Production Environment
To set up the production environment, create a .env.production file in the back-end directory:

1. **Navigate to the back-end directory**:
  ```bash
  cd back-end
  ```

2. **Create a *.env.production* file**:
   ```bash
   touch .env.production
   ```

3. **Add the following configuration to the *.env*.production file**:
   ```env
   NODE_ENV="production"
   DATABASE_URL="mysql://<user>:<password>@localhost:3306/online_chat"
   BASE_URL=<url>
   PORT=1337
   JWT_SECRET=<secret>
   ```

*The PM2 will utilize this file when running the server in production with the --env production flag.*

#### Configuration Notes

- **Environment Variables:** The `.env` file is crucial for configuring different parts of your application. Ensure that values such as `PORT`, `BASE_URL`, and `DATABASE_URL` match between the front-end and back-end to ensure proper communication.
- **SMTP Configuration:** For email functionality, configure SMTP settings according to your email service provider. For Gmail, you may need to generate an app-specific password.
- **Cloudflare R2 Configuration:** Ensure the `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ENDPOINT`, and `R2_PUBLIC_ENDPOINT` are properly configured in the .env file. These values are critical for managing file storage and uploads within the application. Make sure your access keys are secure and not shared publicly.
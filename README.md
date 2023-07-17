# Photo Caption Contest Platform Backend

## Overview

This project is a backend for a platform where users can participate in a photo caption contest. The server hosts a few images and provides endpoints to authenticate and authorize users. Users must be signed in to create a caption. The project includes a database design and schema for storing users and captions.

## How to use

1. Install Node.js and npm on your machine.
2. Run `npm install` to install the project dependencies.
3. Install Postgres and edit your connection details on `config/config.js`.
4. Run `npx sequelize db:migrate` to build tables on the database.
5. Install Redis on your machine or use a Docker Redis image and edit your connection details on `config/config.js`.
6. Run `npm start` or `npm test` for nodemon (debugging mode).

Alternatively, you can run the project in a Docker environment:

1. Install Docker.
2. Install Postgres and edit your connection details in `docker-compose.yml` and `config/config.js`.
3. Run `docker-compose build && docker-compose up`.

Access the API documentation at `localhost:5000/docs`.

## Architecture

The project consists of three layers: the database layer, the cache layer, and the application layer.

### Database Layer

The database layer uses Postgres to store user and caption data. The schema is managed using Sequelize migrations.

### Cache Layer

The cache layer uses Redis to cache frequently accessed data, such as user and caption data. Redis is also used for session management.

### Application Layer

The application layer is built using Node.js and Express. It provides endpoints for user authentication and authorization, image and caption management, and Swagger documentation. The application layer also uses Sequelize as an ORM to interact with the database layer.

## Steps Taken

The following steps were taken to create the project:

1. Install project dependencies: `npm install`.
2. Create a `sequelizerc` file to specify the location of the config folder.
3. Initialize Sequelize: `npx sequelize init`.
4. Create the database: `npx sequelize db:create`.
5. Create data models for users, photos, and captions using `npx sequelize model:generate`.
6. Create endpoints for user, images and captions in the `routes` and `services` folders.
7. Implement user authentication and authorization using bcrypt, JWT, and Redis.
8. Add middleware to enforce authorization for certain endpoints.
9. Configure Redis with Docker and use it for caching and session management.
10. Implement database migrations using Sequelize.
11. Implement seeders to automatically create example user, photo, and caption records.
12. Test the endpoints using Postman and Sequelize seeders.
13. Dockerize the app and deploy it to Google Cloud Run with Cloud SQL and Memorystore (i.e. managed postgres and redis instance).
14. Clean up the Google Cloud resources.

## Skills Demonstrated

This project demonstrates proficiency in the following skills:

- Node.js and Express
- SQL and Sequelize (ORM)
- Redis and caching
- Docker and containerization
- Google Cloud Platform, including Cloud Run, Cloud SQL, Redis Memorystore and Artifact Registry 
- JWT and authentication
- Swagger documentation
- Relational data modeling and schema design
- Automated testing with Postman and Sequelize seeders
- Git and GitHub for version control
- CI/CD pipelines (future plan)

## Inspiration
This project was inspired by the Codecademy Back-end Engineer Career Path . The project requirements and specifications were adapted from the "Photo Caption Contest" project in the Career Path. The project provided a great starting point for building a REST API using Node.js, Express, and Sequelize.
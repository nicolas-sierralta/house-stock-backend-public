# House Stock Backend

This project demonstrates a microservices architecture using Docker. It consists of several independent services that interact with each other through an API Gateway and a series of backend services. Below is a description of each service, how to configure them, and how to run them.

## Services

### api-gateway

The entry point for requests to the various services. It routes traffic to the appropriate services.

- **Port**: `3000`
- **Dependencies**: `auth-service`, `product-service`, `ocr-service`

### auth-service

Handles user authentication and registration. Allows users to register, log in, and change passwords.

- **Port**: `4000`
- **Dependencies**: `mysql-auth`

### user-service

Manages user information, including creating, updating, and retrieving user data.

- **Port**: `4001`
- **Dependencies**: `mysql-user`

### ocr-service

Provides Optical Character Recognition (OCR) capabilities to process documents and receipts.

- **Port**: `4002`

### product-service

Manages products in an inventory, allowing for adding, updating, and deleting products, as well as syncing inventory.

- **Port**: `4003`
- **Dependencies**: `mysql-product`

### MySQL Databases

Each service that requires data persistence uses a separate MySQL database:

- **mysql-auth**: Database for `auth-service`
- **mysql-user**: Database for `user-service`
- **mysql-product**: Database for `product-service`

## Configuration

### Prerequisites

- Docker
- Docker Compose

### Environment Variables

Ensure you have `.env` files for each service (`./api-gateway/.env`, `./auth-service/.env`, etc.). These files should contain the necessary credentials and configurations for each service.

### Api Gateway

- JWT_SECRET=jwt
- PORT=port
- AUTH_SERVICE_URL=auth-url
- USER_SERVICE_URL=user-url
- OCR_SERVICE_URL=ocr-url
- PRODUCT_SERVICE_URL=product-url

### Auth service

- JWT_SECRET=jwt
- MYSQL_HOST=mysql-auth
- MYSQL_USER=authuser
- MYSQL_PASSWORD=password
- MYSQL_DATABASE=authdb
- PORT=port

### MySQL auth

- MYSQL_HOST=mysql-auth
- MYSQL_USER=authuser
- MYSQL_PASSWORD=password
- MYSQL_DATABASE=authdb
- PORT=port

### MySQL product

- MYSQL_ROOT_PASSWORD=password
- MYSQL_DATABASE=productdb
- MYSQL_USER=productuser
- MYSQL_PASSWORD=password

### MySQL user

- MYSQL_ROOT_PASSWORD=password
- MYSQL_DATABASE=userdb
- MYSQL_USER=user
- MYSQL_PASSWORD=password

### OCR Service

- FORM_RECOGNIZER_ENDPOINT=api_ocr_azure
- FORM_RECOGNIZER_API_KEY=key
- PORT=port

### Product service

- MYSQL_HOST=mysql-product
- MYSQL_USER=productuser
- MYSQL_PASSWORD=password
- MYSQL_DATABASE=productdb
- PORT=port

### User service

- MYSQL_HOST=mysql-user
- MYSQL_USER=user
- MYSQL_PASSWORD=password
- MYSQL_DATABASE=userdb
- PORT=port


### Start up
docker-compose up --build


## Running Services on Separate Machines

If you prefer to run each service on separate machines, ensure that you update the environment variables in each service’s `.env` file to point to the correct IP addresses or hostnames of the other services.

### Directory Structure

- **api-gateway/**: Code and configuration for the API Gateway.
- **auth-service/**: Code and configuration for the authentication service.
- **ocr-service/**: Code and configuration for the OCR service.
- **product-service/**: Code and configuration for the product service.
- **user-service/**: Code and configuration for the user service.
- **mysql-auth/**: Configuration and initial data for the authentication database.
- **mysql-user/**: Configuration and initial data for the user database.
- **mysql-product/**: Configuration and initial data for the product database.

## More info
For more information, see the documentation generated with JSDoc in the ./docs folder.
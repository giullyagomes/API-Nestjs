# Online Shopping System API

This is a backend API for an online shopping system built with NestJS, TypeScript, and SQLite. It provides functionality for product management, shopping cart operations, user authentication, and order processing.

## Features

- **Product Management**: CRUD operations for products, including search by criteria
- **Shopping Cart**: Add, remove, update items in cart
- **User Authentication**: Register, login with JWT
- **Order Processing**: Checkout process, order history
- **API Documentation**: Swagger/OpenAPI docs

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/online-shopping-api.git
cd online-shopping-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```
# Application
NODE_ENV=development
PORT=3000

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1d
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The application will be available at http://localhost:3000.

### Production Mode

```bash
npm run build
npm run start:prod
```

## API Documentation

Swagger documentation is available at http://localhost:3000/api when the application is running.

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Products

- `GET /products` - Get all products (with filtering)
- `GET /products/:id` - Get a specific product
- `POST /products` - Create a new product (admin only)
- `PATCH /products/:id` - Update a product (admin only)
- `DELETE /products/:id` - Delete a product (admin only)

### Shopping Cart

- `GET /cart` - Get user's cart
- `POST /cart` - Add product to cart
- `PATCH /cart/:id` - Update cart item quantity
- `DELETE /cart/:id` - Remove item from cart
- `DELETE /cart` - Clear cart

### Orders

- `POST /orders` - Create a new order from cart
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get a specific order
- `PATCH /orders/:id/status` - Update order status (admin only)
- `GET /orders/all` - Get all orders (admin only)

### Users

- `GET /users/profile` - Get current user profile
- `PATCH /users/:id` - Update user profile
- `GET /users` - Get all users (admin only)
- `DELETE /users/:id` - Delete a user (admin only)

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Database

The application uses SQLite as the database, which is stored in the `database.sqlite` file in the root directory. In development mode, the database schema is automatically created using TypeORM synchronize.

## Project Structure

```
src/
├── auth/                  # Authentication module
├── cart/                  # Shopping cart module
├── common/                # Common utilities, decorators, etc.
├── orders/                # Orders module
├── products/              # Products module
├── users/                 # Users module
├── app.module.ts          # Main application module
└── main.ts                # Application entry point
```

## Role-Based Access Control

The application supports two roles:
- **User**: Can manage their cart, place orders, and view their profile
- **Admin**: Can manage products, view all orders, and update order status

## Example API Requests

### Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "fullName": "John Doe",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Product (Admin Only)

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Wireless Headphones",
    "description": "High quality wireless headphones with noise cancellation",
    "price": 99.99,
    "stockQuantity": 100,
    "category": "Electronics",
    "imageUrl": "https://example.com/headphones.jpg"
  }'
```

### Add Product to Cart

```bash
curl -X POST http://localhost:3000/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": "product-uuid-here",
    "quantity": 2
  }'
```

### Create an Order

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "shippingAddress": "123 Main St, Anytown, AT 12345"
  }'
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
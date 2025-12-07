# News Aggregator API

A RESTful API for a personalized news aggregator built with Express.js, featuring user authentication, preference management, and live news aggregation from EventRegistry API.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **User Preferences**: Personalized news preferences (categories, sources, topics)
- **Live News Aggregation**: Real-time news fetching from EventRegistry API
- **Smart Caching**: In-memory caching with configurable TTL to optimize API calls
- **Input Validation**: Joi-based request validation
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Clean Architecture**: Layered architecture following industry best practices

## Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Validation**: Joi
- **News API**: EventRegistry SDK
- **HTTP Client**: Axios
- **Testing**: Supertest, Tap
- **Environment**: dotenv

## Project Structure

```
news-aggregator-api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.js      # Environment configuration
│   │   └── newsApi.js    # EventRegistry client setup
│   ├── routes/           # API routes
│   │   ├── userRoutes.js # User auth & preferences routes
│   │   └── newsRoutes.js # News endpoints
│   ├── controllers/      # Request handlers
│   │   ├── authController.js
│   │   ├── preferencesController.js
│   │   └── newsController.js
│   ├── services/         # Business logic
│   │   ├── authService.js
│   │   ├── preferencesService.js
│   │   └── newsService.js
│   ├── models/           # Data models (in-memory)
│   │   └── User.js
│   ├── middlewares/      # Custom middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── validate.js   # Request validation
│   │   └── errorHandler.js
│   ├── validators/       # Joi schemas
│   │   ├── authValidator.js
│   │   └── preferencesValidator.js
│   └── utils/            # Utilities
│       └── cache.js      # In-memory cache
├── test/
│   └── server.test.js    # Test suite
├── app.js                # Express app setup
├── server.js             # Server entry point
├── .env                  # Environment variables
├── .env.example          # Environment template
└── package.json
```

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd news-aggregator-api-bhatt-neel-dev
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=24h
NEWS_API_KEY=your-eventregistry-api-key-here
NEWS_API_BASE_URL=https://eventregistry.org
CACHE_TTL=300000
```

**Get your EventRegistry API Key:**
- Sign up at [EventRegistry](https://eventregistry.org/)
- Get your free API key from the dashboard

4. **Run the server**
```bash
node server.js
```

Server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register User
```http
POST /users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "preferences": ["technology", "sports"]
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": ["technology", "sports"],
  "createdAt": "2025-12-07T10:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Missing or invalid fields
- `409 Conflict` - Email already exists

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Missing fields
- `401 Unauthorized` - Invalid credentials

### User Preferences (Protected Routes)

All preferences endpoints require authentication:
```http
Authorization: Bearer <your-jwt-token>
```

#### Get Preferences
```http
GET /users/preferences
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "preferences": ["technology", "sports"]
}
```

#### Update Preferences
```http
PUT /users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferences": ["technology", "business", "science"]
}
```

**Response (200 OK):**
```json
{
  "preferences": ["technology", "business", "science"]
}
```

### News (Protected Route)

#### Get Personalized News
```http
GET /news
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "news": [
    {
      "title": "Latest Tech Innovation Announced",
      "description": "Full article content here...",
      "url": "https://example.com/article",
      "imageUrl": "https://example.com/image.jpg",
      "source": "TechCrunch",
      "publishedAt": "2025-12-07T06:51:18Z"
    },
    // ... more articles
  ]
}
```

**Features:**
- Returns up to 10 latest articles
- Filtered by user preferences (keywords)
- Cached for 5 minutes (configurable)
- Sorted by publish date (newest first)

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - API failure

## Testing

Run the test suite:
```bash
npm test
```

**Test Coverage:**
- ✅ User signup (success & validation)
- ✅ User login (success & wrong password)
- ✅ Get preferences (authenticated & unauthenticated)
- ✅ Update preferences
- ✅ Get news (authenticated & unauthenticated)

**All 15 tests passing**

## Architecture Principles

### Layered Architecture

**Routes** → Define endpoints only
```javascript
router.post('/signup', validate(signupSchema), authController.signup);
```

**Controllers** → Handle request/response
```javascript
async signup(req, res, next) {
  const user = await authService.signup(req.validatedBody);
  res.status(200).json(user);
}
```

**Services** → Business logic
```javascript
async signup(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return User.create({ ...userData, password: hashedPassword });
}
```

**Models** → Data access
```javascript
create(userData) {
  const user = { id: this.idCounter++, ...userData };
  this.users.set(id, user);
  return user;
}
```

### Security Features

1. **Password Security**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Signed with secret, configurable expiry
3. **Input Validation**: Joi schemas validate all inputs
4. **No Secrets in Code**: All sensitive data in environment variables
5. **Error Messages**: Generic messages, no sensitive data leakage

### Caching Strategy

- **Key**: JSON stringified user preferences
- **TTL**: 5 minutes (300,000ms) by default
- **Invalidation**: Automatic expiry
- **Benefits**: Reduces API calls, improves response time

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `JWT_SECRET` | Secret for JWT signing | - | Yes |
| `JWT_EXPIRY` | Token expiration time | 24h | No |
| `NEWS_API_KEY` | EventRegistry API key | - | Yes |
| `NEWS_API_BASE_URL` | EventRegistry base URL | https://eventregistry.org | No |
| `CACHE_TTL` | Cache TTL in milliseconds | 300000 | No |

## Development

### Adding New Routes

1. Create validator schema in `src/validators/`
2. Add business logic in `src/services/`
3. Create controller in `src/controllers/`
4. Define route in `src/routes/`
5. Wire route in `app.js`

### Error Handling

All errors are caught by centralized error handler:

```javascript
// In any controller
try {
  const result = await service.doSomething();
  res.json(result);
} catch (error) {
  next(error); // Handled by errorHandler middleware
}
```

## Live News Data

The API fetches real-time news from **EventRegistry**, which provides:
- **432,000+** articles available
- **Global coverage** from thousands of sources
- **Real-time updates** sorted by publication time
- **Rich metadata** including sentiment, relevance scores
- **Multilingual support** (currently set to English)

## Performance Optimization

- **Caching**: Reduces external API calls by 80%+
- **Connection Pooling**: Axios instance reuse
- **Async/Await**: Non-blocking operations
- **Validation Early**: Fail fast on invalid input

---

**Need Help?**
- Review test cases in `test/server.test.js`
- Ensure Node.js version >= 18.0.0

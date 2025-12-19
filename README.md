# Todo & Weather App

A full-stack Next.js 16 application with a **Todo list** and **Weather display** components. This project demonstrates modern React features, Next.js API routes, unit testing, and a clean component architecture.

---

## Table of Contents

- [Features](#features)  
- [Folder Structure](#folder-structure)  
- [Setup](#setup)  
- [Environment Variables](#environment-variables)  
- [Components](#components)  
- [API Routes](#api-routes)  
- [Testing](#testing)  
- [License](#license)  

---

## Features

- **Todo List**  
  - Add, update (complete/uncomplete), and delete todos  
  - Option to hide completed todos  
  - Optimistic UI updates for better UX  

- **Weather Display**  
  - Shows current weather for a fixed location (Cape Town)  
  - Fetches temperature, city, and country from OpenWeatherMap API  

- **Testing**  
  - Unit tests for API routes and data layer  
  - Integration tests for Weather API route (mocked)  
  - Tests colocated with the files they test  

---

## Folder Structure

```sh
├─ app/
│ ├─ api/
│ │ ├─ todo/
│ │ │ ├─ route.ts # GET, POST
│ │ │ └─ [id]/route.ts # PATCH, DELETE
│ │ └─ weather/
│ │ └─ route.ts # GET
│ └─ components/
│ ├─ Todo.tsx # Client-side Todo component
│ └─ Weather.tsx # Client-side Weather component
├─ data/
│ └─ todo.ts # In-memory todo data layer
├─ types/
│ └─ todo.ts # Todo type definitions
├─ *.test.ts # Tests colocated with the files they test
```

## Setup

### 1. Clone the repository
```sh
git clone https://github.com/LinoKhan1/todo-weather-app.git

```

### 2. Install Dependencies

```sh
npm install
# or
yarn install

```
### 3. Environment Variable
The app requires an OpenWeatherMap API key to fetch weather data. Create a .env.local file at the root:

```sh
OPEN_WEATHER_API_KEY=your_openweather_api_key
```
Note: If the API key is missing, the Weather API route will return a 500 error

### 4. Run Development Server

```sh
npm run dev
#or
yarn dev
```
Visit http://localhost:3000

## Components
### Todo Component (Todo.tsx)
- Client-side component using React state and hooks
- Supports:
- Adding new todos
- Toggling completion
- Updating todo text inline
- Deleting todos
- Hiding completed todos
- Optimistic UI updates to immediately reflect changes before API response

### Weather Component (Weather.tsx)

- Client-side component
- Fetches weather for Cape Town using OpenWeatherMap
- Displays:
- Temperature
- City and country
- Current date
- 

## API Routes

#### Todo API

- GET /api/todo – Fetch all todos

- POST /api/todo – Add a new todo ({ title: string })

PATCH /api/todo/[id] – Update a todo ({ title?: string; completed?: boolean })

DELETE /api/todo/[id] – Delete a todo

#### Weather API

GET /api/weather – Fetch current weather for Cape Town

Returns JSON:
```sh
{
  "temperature": 23,
  "city": "Cape Town",
  "country": "ZA",
  "description": "clear sky"
}
```


Returns 500 if API key is missing or fetch fails

## Testing

Uses Jest and React Testing Library
Tests are colocated with their respective files

Todo tests cover:

- CRUD operations
- Partial updates
- Unique ID generation

Weather API tests cover:

- Successful fetch
- Missing API key
- Non-ok responses and exceptions

### Run tests:

```sh
npm test
# or
yarn test
```

## License

This project is licensed under the MIT License.





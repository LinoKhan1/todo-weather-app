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




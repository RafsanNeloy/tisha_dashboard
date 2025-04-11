#!/bin/bash

# Navigate to the backend directory
cd backend

# Start the backend server
npm start &

# Navigate back to the frontend root directory
cd ..

# Start the frontend server
npm start
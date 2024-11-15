# Build stage
FROM node:20-slim as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Serve stage
FROM node:20-slim as serve

# Set working directory
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built assets from build stage
COPY --from=build /app/dist ./dist

# Expose port 3000
EXPOSE 3446

# Start serve
CMD ["serve", "-s", "dist", "-l", "3446"]
# Use Node.js for building and running
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Expose port for dev server
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]

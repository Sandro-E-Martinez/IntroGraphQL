FROM node:14.17.4-alpine

EXPOSE 4000

# Create/Set the working directory
RUN mkdir /app
WORKDIR /app

COPY backend/package*.json .
RUN npm install

# Set Command
CMD ["npm", "start"]
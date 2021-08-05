FROM node:14.17.4-alpine

EXPOSE 3000

# Create/Set the working directory
RUN mkdir /app
WORKDIR /app

COPY frontend/package*.json .
RUN npm install

# Set Command
CMD ["npm", "start"]
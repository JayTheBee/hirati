FROM node:19-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN ls -la
# Copy app files
COPY . .
# Expose port
# EXPOSE 3000
# Start the app
CMD [ "npm","run", "dev" ]
# CMD [ "ls","-Ral" ]
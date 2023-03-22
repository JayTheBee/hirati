FROM node:19-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
# ARG REACT_APP_BACKEND_ADDRESS
# ENV REACT_APP_BACKEND_ADDRESS $REACT_APP_BACKEND_ADDRESS
# Copy app files
COPY . .
# Expose port
# Start the app
CMD [ "npm","run", "dev" ]
# CMD [ "ls","-Ral" ]
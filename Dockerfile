FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy package.json to the container
COPY package.json .

# Install app dependencies
RUN npm install

# Copy the rest of the app files to the container
COPY . ./

# Expose the port that the app will listen on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]

# docker tag calculator artisticknock/calculator
# docker pushed to artisticknock/calculator
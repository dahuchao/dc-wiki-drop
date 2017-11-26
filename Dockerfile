FROM dahu.chao/rpi-node

# Adding source files into container
ADD ./ /app

# Define working directory
WORKDIR /app

# Install app dependencies
RUN npm install

# Define working directory
WORKDIR /app/client

# Install app dependencies
RUN npm install

# Open Port 80
EXPOSE 80

# Run Node.js
CMD ["npm", "start"]
# Use an official Linux distribution as a parent image
FROM node:latest

# Create a directory for your application
WORKDIR /app

# Expose port 3000 to the host
EXPOSE 3000

# Copy a script to the container
COPY ./entrypoint.sh /entrypoint.sh

# Make the script executable
RUN chmod +x /entrypoint.sh

# Set the script as the entry point
ENTRYPOINT ["/entrypoint.sh"]

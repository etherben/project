FROM openjdk:21-jdk-slim AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the pre-built JAR file into the container
COPY build/libs/pftrackerback-0.0.1-SNAPSHOT.jar /app/pftrackerback.jar

# Expose the port the app will run on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/pftrackerback.jar"]
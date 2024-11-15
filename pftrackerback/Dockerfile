# Use an official OpenJDK runtime as the base image
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Spring Boot JAR file from your local machine to the container
COPY build/libs/pftrackerback-0.0.1-SNAPSHOT.jar pftrackerback.jar

# Expose the port that Spring Boot is running on
EXPOSE 8080

# Define the command to run your JAR file
ENTRYPOINT ["java", "-jar", "pftrackerback.jar"]
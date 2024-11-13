FROM openjdk:23-jdk-slim
WORKDIR /app
COPY build/libs/pftracker_backend-0.0.1-SNAPSHOT.jar  app.jar
EXPOSE 8088
CMD ["java", "-jar", "app.jar"]
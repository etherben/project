
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY build/libs/pftrackerback-0.0.1-SNAPSHOT.jar pftrackerback.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "pftrackerback.jar"]
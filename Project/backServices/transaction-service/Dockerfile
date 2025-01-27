
# Start from an OpenJDK image
FROM openjdk:21-jdk-slim

# Install Gradle
RUN apt-get update && \
    apt-get install -y wget unzip && \
    wget https://services.gradle.org/distributions/gradle-8.4-bin.zip && \
    unzip gradle-8.4-bin.zip && \
    mv gradle-8.4 /opt/gradle && \
    ln -s /opt/gradle/bin/gradle /usr/bin/gradle && \
    rm gradle-8.4-bin.zip


WORKDIR /app

COPY . .


RUN gradle build --no-daemon


EXPOSE 8081


ENTRYPOINT ["java", "-jar", "build/libs/*-0.0.1-SNAPSHOT.jar"]
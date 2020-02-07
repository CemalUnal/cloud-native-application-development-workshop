FROM maven:3.6.1-jdk-11-slim as maven

WORKDIR /app
COPY ./pom.xml ./pom.xml

# build all dependencies
RUN mvn dependency:go-offline -B

COPY ./src ./src

RUN mvn clean package

# specify base image runtime
FROM openjdk:11.0-jre-slim

WORKDIR /app
VOLUME /tmp

# copy over the built artifact from the maven image
COPY --from=maven /app/target/*.jar /app/target/

# USER backend

# set the startup command to run binary
CMD java ${JAVA_OPTS} -jar  /app/target/*.jar

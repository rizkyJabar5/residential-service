FROM gradle:jdk17-alpine AS build-gradle
ENV APP_HOME=/opt/application
WORKDIR $APP_HOME
COPY backend/ .
RUN gradle bootJar

FROM openjdk:17-jdk-alpine
RUN apk add --no-cache nodejs npm

ENV JAR_FILE=residential-management-0.0.1-SNAPSHOT.jar
WORKDIR /srv/app

# Copy application files
COPY --from=build-gradle /opt/application/build/libs/$JAR_FILE .

RUN chmod +x "$JAR_FILE"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar $JAR_FILE"]

HEALTHCHECK --interval=5m --timeout=3s \
  CMD ["sh", "-c", "pgrep -f java"]

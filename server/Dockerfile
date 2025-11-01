FROM amazoncorretto:17 AS build

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew

RUN ./gradlew build -x test --no-daemon

FROM amazoncorretto:17 AS runner

WORKDIR /app

COPY --from=build /app/build/libs/Backend-0.0.1-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "/app/app.jar"]

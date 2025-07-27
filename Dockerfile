FROM oven/bun

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 8080

CMD ["bun", "src/index.ts"]

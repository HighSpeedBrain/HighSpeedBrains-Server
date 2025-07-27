# --- Stage 1: Build app ---
FROM oven/bun:1 AS builder
WORKDIR /app

COPY . .

RUN bun install
RUN bunx tsc

# --- Stage 2: Copy Bun runtime and built app ---
FROM oven/bun:1.0.5-distroless AS final

# Copy compiled app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/

# Set working directory
WORKDIR /app

# Set entrypoint
CMD ["bun", "dist/index.js"]

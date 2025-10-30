# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy the rest of your app and build
COPY . .
RUN pnpm build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Install pnpm for production
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy the built app
COPY --from=build /app/.output .

# Set runtime environment variables
ENV NODE_ENV=production

CMD ["node", "server/index.mjs"]
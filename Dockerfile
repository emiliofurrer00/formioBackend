# BUILD STAGE: Istalling deps, generating prisma client, compiling ts
FROM node:20-alpine AS build

WORKDIR /app

# Install app dependencies
# We first copy dependency files to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Specify the variable you need
ARG DATABASE_URL
# Use the variable
RUN echo $DATABASE_URL

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN yarn prisma:generate

# Copy the rest of the application source code
COPY . .
RUN yarn build

# RUNTIME STAGE: Smaller image for running the app
# TO DO: Prune dev dependencies

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files from the build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Specify the variable you need
ARG DATABASE_URL
# Use the variable
RUN echo $DATABASE_URL

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"]
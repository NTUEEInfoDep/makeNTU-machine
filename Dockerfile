FROM node:18-alpine
WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile

ENV DATABASE_URL "postgresql://user:1234@postgres:5432/MNTU?schema=public"
ENV PASSWORD_SECRET "Secret"
ENV JWT_EXPIRES_IN "24h"

RUN yarn build

CMD ["yarn", "run", "deploy"]
FROM node:18-alpine
WORKDIR /app

COPY . .
RUN npm install --frozen-lockfile

ENV DATABASE_URL "postgresql://user:1234@localhost:5432/MNTU?schema=public"
ENV PASSWORD_SECRET "Secret"
ENV JWT_EXPIRES_IN "24h"

RUN npm run build

CMD ["npm", "run", "deploy"]
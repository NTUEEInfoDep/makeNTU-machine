import dotenv from "dotenv";

dotenv.config({path:"../../.env"});

type ENV = {
//   NEXT_PUBLIC_API_URL: string,
PASSWORD_SECRET: string,
POSTGRES_URL: string,
JWT_EXPIRES_IN: string,
}

export const env:ENV = {
  PASSWORD_SECRET: process.env.JWT_SECRET!,
  POSTGRES_URL: process.env.POSTGRES_URL!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
}
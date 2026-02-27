// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import {prisma} from "./prisma";
import "dotenv/config";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    emailAndPassword: {
      enabled: true,
    },
    baseURL: process.env.BACKEND_URL,
    trustedOrigins : [process.env.APP_URL!],
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "STUDENT",
          required: true
        },
        phone: {
          type: "string",
          required: false
        },
        status:{
          type: "string",
          defaultValue: "ACTIVE",
          required: false
        }
      }
    },
    // advanced: {
    //   cookiePrefix: "better-auth",
    //   cookies: {
    //     session_token: {
    //       attributes: {
    //         secure: true,
    //         sameSite: "none",
    //         httpOnly: true,
    //       }
    //     }
    //   }
    // }
});
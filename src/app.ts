import express,{Request,Response} from "express";
import cors from 'cors';
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import tutorRoutes from "./modules/tutor/tutor.routes";

const app = express();

app.use(cors({
    origin: process.env.APP_URL || "https://skill-bridge-frontend-eight.vercel.app",
    credentials: true
}));

app.use(express.json());

app.all("/api/auth/*splat",toNodeHandler(auth));
app.use("/tutors",tutorRoutes);

app.use("/",(req:Request,res:Response)=>{
    res.status(200).json({
        "message" : "server is running perfectly"
    });
});

export default app;
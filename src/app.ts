import express,{Request,Response} from "express";

const app = express();

app.use(express.json());

app.use("/",(req:Request,res:Response)=>{
    res.status(200).json({
        "message" : "server is running perfectly"
    });
});

export default app;
import express, { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
import { initTelegramBot } from './bot';

import { createYoga } from 'graphql-yoga';
import { schema } from './QL_Schema';

//"start": "nodemon --exec ts-node src/index.ts",

const port = process.env.PORT || 3000;
const app = express();

// Initialize Yoga
const yoga = createYoga({
    schema,
});


// Apply Yoga as middleware to Express
app.use('/graphql', yoga);

//start telegram bot API
initTelegramBot();


app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});

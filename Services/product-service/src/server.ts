import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';

const app = express();
const PORT = 8001;

app.use(helmet);

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Middleware

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

//Health check

app.get('/health', (req: Request, res: Response) => {
  res.send('Product Service is running with TypeScript');
});

// app.use('/v1/auth', createProductRoute);

app.listen(PORT, () => {
  console.log('Server Product is running');
});

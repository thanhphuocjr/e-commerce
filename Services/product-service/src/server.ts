import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = 8001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Product Service is running with TypeScript');
});

app.listen(PORT, () => {
  console.log('Server Product is running');
});

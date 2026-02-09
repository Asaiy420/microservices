import type { Request, Response } from 'express';
import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('User service is up and running!');
});

app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});

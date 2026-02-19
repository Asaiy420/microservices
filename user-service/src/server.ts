import type { Request, Response } from 'express';
import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
  name: string;
  email: string;
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded());

const conn = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/user');
    console.log('MongoDB Connected Successfully');
  } catch (e: unknown) {
    console.error('Error when connecting to the database', e);
  }
};

// Creating User Schema Here; Will do everything in this file no different file structure
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
});
const User = mongoose.model('User', userSchema);
app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({ message: 'Name and Email are required' });
      return;
    }
    const user = new User({ name, email });
    await user.save();

    res.status(201).json({ message: 'User Created Successfully!', user });
    return;
  } catch (e: unknown) {
    console.error('Error when creating a user', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/users', async (req: Request, res: Response) => {
  try {
    const listUsers = await User.find();
    res.status(200).json({message: "All Users haven been lsited", listUsers })
    return;
  } catch (e: unknown) {
    console.error('Error when fetching users', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('User service is up and running!');
});

app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
  conn();
});

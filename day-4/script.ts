import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Middleware to check if the user is Admin
const isAdmin = async (req, res, next) => {
  const { userId } = req.headers; // Assume `userId` is passed in the request headers.

  if (!userId) {
    return res.status(401).json({ error: 'User ID is required in headers.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ error: "You don't have access to this API." });
    }

    next(); // User is Admin, proceed to the API handler.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Users - Only Admins can access
app.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User by ID - Only Admins can access
app.get('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create User - Only Admins can create
app.post('/users', isAdmin, async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email, role },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User - Only Admins can update
app.put('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User - Only Admins can delete
app.delete('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: 'User deleted', user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

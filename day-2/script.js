const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const app = express();
app.use(express.json());
app.use(router);

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers['admin-id'];
    
    if (!userId) {
      return res.status(400).json({ error: 'Admin ID is required in the Authorization header' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }, 
    });

    if (user && user.role === 'Admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access forbidden: Admins only' });
    }
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

router.post('/users', isAdmin, async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'User',
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

router.get('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

router.put('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

router.delete('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
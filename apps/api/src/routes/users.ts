import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  venmoHandle: z.string().max(50).optional().nullable(),
  cashAppHandle: z.string().max(50).optional().nullable(),
  paypalHandle: z.string().max(100).optional().nullable(),
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  const user = await db.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      avatarUrl: true,
      venmoHandle: true,
      cashAppHandle: true,
      paypalHandle: true,
      createdAt: true,
    },
  });
  res.json(user);
});

// Update current user
router.patch('/me', requireAuth, async (req, res) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await db.user.update({
      where: { id: req.user!.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        venmoHandle: true,
        cashAppHandle: true,
        paypalHandle: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID (public profile)
router.get('/:id', async (req, res) => {
  const user = await db.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      venmoHandle: true,
      cashAppHandle: true,
      paypalHandle: true,
      createdAt: true,
      skills: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          priceType: true,
          category: true,
        },
      },
      _count: {
        select: {
          skills: { where: { isActive: true } },
          needs: { where: { isFulfilled: false } },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

export default router;

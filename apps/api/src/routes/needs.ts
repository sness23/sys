import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

const createNeedSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  budget: z.number().int().positive().optional().nullable(),
  category: z.string().min(1).max(50),
});

const updateNeedSchema = createNeedSchema.partial().extend({
  isFulfilled: z.boolean().optional(),
});

// List needs (with filtering)
router.get('/', optionalAuth, async (req, res) => {
  const { category, search, userId, limit = '20', offset = '0' } = req.query;

  const where: any = { isFulfilled: false };

  if (category && category !== 'undefined') {
    where.category = category;
  }

  if (userId) {
    where.userId = userId;
  }

  if (search && search !== 'undefined') {
    where.OR = [
      { title: { contains: search as string } },
      { description: { contains: search as string } },
    ];
  }

  const needs = await db.need.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: Math.min(parseInt(limit as string), 50),
    skip: parseInt(offset as string),
  });

  const total = await db.need.count({ where });

  res.json({ needs, total });
});

// Get my needs
router.get('/mine', requireAuth, async (req, res) => {
  const needs = await db.need.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(needs);
});

// Get need by ID
router.get('/:id', async (req, res) => {
  const need = await db.need.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          bio: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!need) {
    return res.status(404).json({ error: 'Need not found' });
  }

  res.json(need);
});

// Create need
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = createNeedSchema.parse(req.body);

    const need = await db.need.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
    });

    res.status(201).json(need);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create need error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update need
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const need = await db.need.findUnique({
      where: { id: req.params.id },
    });

    if (!need) {
      return res.status(404).json({ error: 'Need not found' });
    }

    if (need.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const data = updateNeedSchema.parse(req.body);

    const updated = await db.need.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update need error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete need
router.delete('/:id', requireAuth, async (req, res) => {
  const need = await db.need.findUnique({
    where: { id: req.params.id },
  });

  if (!need) {
    return res.status(404).json({ error: 'Need not found' });
  }

  if (need.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await db.need.delete({ where: { id: req.params.id } });

  res.json({ success: true });
});

export default router;

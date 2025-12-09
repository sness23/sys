import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

const createSkillSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  price: z.number().int().positive(),
  priceType: z.enum(['HOURLY', 'SESSION', 'FLAT']),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

const updateSkillSchema = createSkillSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// List skills (with filtering)
router.get('/', optionalAuth, async (req, res) => {
  const { category, search, userId, limit = '20', offset = '0' } = req.query;

  const where: any = { isActive: true };

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

  const skills = await db.skill.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          venmoHandle: true,
          cashAppHandle: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: Math.min(parseInt(limit as string), 50),
    skip: parseInt(offset as string),
  });

  const total = await db.skill.count({ where });

  res.json({ skills, total });
});

// Get my skills
router.get('/mine', requireAuth, async (req, res) => {
  const skills = await db.skill.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(skills);
});

// Get skill by ID
router.get('/:id', async (req, res) => {
  const skill = await db.skill.findUnique({
    where: { id: req.params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          bio: true,
          avatarUrl: true,
          venmoHandle: true,
          cashAppHandle: true,
          paypalHandle: true,
        },
      },
    },
  });

  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  res.json(skill);
});

// Create skill
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = createSkillSchema.parse(req.body);

    const skill = await db.skill.create({
      data: {
        ...data,
        tags: JSON.stringify(data.tags || []),
        userId: req.user!.id,
      },
    });

    res.status(201).json({ ...skill, tags: JSON.parse(skill.tags) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update skill
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const skill = await db.skill.findUnique({
      where: { id: req.params.id },
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skill.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const data = updateSkillSchema.parse(req.body);

    const updated = await db.skill.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete skill
router.delete('/:id', requireAuth, async (req, res) => {
  const skill = await db.skill.findUnique({
    where: { id: req.params.id },
  });

  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  if (skill.userId !== req.user!.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await db.skill.delete({ where: { id: req.params.id } });

  res.json({ success: true });
});

export default router;

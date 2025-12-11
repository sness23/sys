import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createRequestSchema = z.object({
  skillId: z.string(),
  message: z.string().max(1000).optional(),
});

const updateRequestSchema = z.object({
  status: z.enum(['APPROVED', 'DECLINED', 'CANCELLED', 'COMPLETED']),
});

// Get my requests (sent and received)
router.get('/', requireAuth, async (req, res) => {
  const { type = 'all' } = req.query;

  let where: any = {};

  if (type === 'sent') {
    where = { requesterId: req.user!.id };
  } else if (type === 'received') {
    where = { providerId: req.user!.id };
  } else {
    where = {
      OR: [
        { requesterId: req.user!.id },
        { providerId: req.user!.id },
      ],
    };
  }

  const requests = await db.serviceRequest.findMany({
    where,
    include: {
      skill: {
        select: {
          id: true,
          title: true,
          price: true,
          priceType: true,
        },
      },
      requester: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      provider: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          venmoHandle: true,
          cashAppHandle: true,
          paypalHandle: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(requests);
});

// Create request
router.post('/', requireAuth, async (req, res) => {
  try {
    const { skillId, message } = createRequestSchema.parse(req.body);

    const skill = await db.skill.findUnique({
      where: { id: skillId },
      include: { user: true },
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (!skill.isActive) {
      return res.status(400).json({ error: 'Skill is not available' });
    }

    if (skill.userId === req.user!.id) {
      return res.status(400).json({ error: 'Cannot request your own skill' });
    }

    // Check for existing pending request
    const existing = await db.serviceRequest.findFirst({
      where: {
        skillId,
        requesterId: req.user!.id,
        status: 'PENDING',
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'You already have a pending request for this skill' });
    }

    const request = await db.serviceRequest.create({
      data: {
        skillId,
        requesterId: req.user!.id,
        providerId: skill.userId,
        message,
      },
      include: {
        skill: true,
        requester: {
          select: { id: true, name: true, avatarUrl: true },
        },
        provider: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    res.status(201).json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update request status
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const request = await db.serviceRequest.findUnique({
      where: { id: req.params.id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const { status } = updateRequestSchema.parse(req.body);

    // Authorization checks
    const isRequester = request.requesterId === req.user!.id;
    const isProvider = request.providerId === req.user!.id;

    if (!isRequester && !isProvider) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Status transition rules
    if (status === 'CANCELLED') {
      if (!isRequester) {
        return res.status(403).json({ error: 'Only requester can cancel' });
      }
      if (request.status !== 'PENDING') {
        return res.status(400).json({ error: 'Can only cancel pending requests' });
      }
    }

    if (status === 'APPROVED' || status === 'DECLINED') {
      if (!isProvider) {
        return res.status(403).json({ error: 'Only provider can approve/decline' });
      }
      if (request.status !== 'PENDING') {
        return res.status(400).json({ error: 'Can only approve/decline pending requests' });
      }
    }

    if (status === 'COMPLETED') {
      if (request.status !== 'APPROVED') {
        return res.status(400).json({ error: 'Can only complete approved requests' });
      }
    }

    const updated = await db.serviceRequest.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        skill: true,
        requester: {
          select: { id: true, name: true, avatarUrl: true },
        },
        provider: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

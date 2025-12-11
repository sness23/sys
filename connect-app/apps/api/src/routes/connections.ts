import { Router } from 'express';
import { randomBytes } from 'crypto';
import { db } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get my connections
router.get('/', requireAuth, async (req, res) => {
  const connections = await db.connection.findMany({
    where: {
      OR: [
        { userId1: req.user!.id, status: 'ACCEPTED' },
        { userId2: req.user!.id, status: 'ACCEPTED' },
      ],
    },
    include: {
      user1: {
        select: { id: true, name: true, avatarUrl: true, bio: true },
      },
      user2: {
        select: { id: true, name: true, avatarUrl: true, bio: true },
      },
    },
  });

  // Return the other user in each connection
  const friends = connections.map(conn => {
    return conn.userId1 === req.user!.id ? conn.user2 : conn.user1;
  });

  res.json(friends);
});

// Generate invite link
router.post('/invite', requireAuth, async (req, res) => {
  const code = randomBytes(8).toString('hex');

  const invite = await db.invite.create({
    data: {
      code,
      inviterId: req.user!.id,
    },
  });

  res.json({ code: invite.code });
});

// Get my invites
router.get('/invites', requireAuth, async (req, res) => {
  const invites = await db.invite.findMany({
    where: { inviterId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(invites);
});

// Accept invite (use invite code to connect)
router.post('/accept/:code', requireAuth, async (req, res) => {
  const invite = await db.invite.findUnique({
    where: { code: req.params.code },
    include: { inviter: { select: { id: true, name: true } } },
  });

  if (!invite) {
    return res.status(404).json({ error: 'Invalid invite code' });
  }

  if (invite.usedById) {
    return res.status(400).json({ error: 'Invite already used' });
  }

  if (invite.inviterId === req.user!.id) {
    return res.status(400).json({ error: 'Cannot use your own invite' });
  }

  // Check if already connected
  const existingConnection = await db.connection.findFirst({
    where: {
      OR: [
        { userId1: req.user!.id, userId2: invite.inviterId },
        { userId1: invite.inviterId, userId2: req.user!.id },
      ],
    },
  });

  if (existingConnection) {
    return res.status(400).json({ error: 'Already connected' });
  }

  // Create connection and mark invite as used
  await db.$transaction([
    db.connection.create({
      data: {
        userId1: invite.inviterId,
        userId2: req.user!.id,
        status: 'ACCEPTED',
      },
    }),
    db.invite.update({
      where: { id: invite.id },
      data: {
        usedById: req.user!.id,
        usedAt: new Date(),
      },
    }),
  ]);

  res.json({ success: true, connectedWith: invite.inviter });
});

// Remove connection
router.delete('/:userId', requireAuth, async (req, res) => {
  const connection = await db.connection.findFirst({
    where: {
      OR: [
        { userId1: req.user!.id, userId2: req.params.userId },
        { userId1: req.params.userId, userId2: req.user!.id },
      ],
    },
  });

  if (!connection) {
    return res.status(404).json({ error: 'Connection not found' });
  }

  await db.connection.delete({ where: { id: connection.id } });

  res.json({ success: true });
});

export default router;

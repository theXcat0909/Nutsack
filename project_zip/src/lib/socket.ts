import { Server } from 'socket.io';
import { db } from './db';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  progress: number;
  rank: number;
}

interface ProgressUpdate {
  userId: string;
  huntId: string;
  clueId: string;
  progress: number;
  score: number;
  status: string;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join hunt room
    socket.on('join-hunt', (huntId: string) => {
      socket.join(`hunt-${huntId}`);
      console.log(`User ${socket.id} joined hunt ${huntId}`);
    });

    // Leave hunt room
    socket.on('leave-hunt', (huntId: string) => {
      socket.leave(`hunt-${huntId}`);
      console.log(`User ${socket.id} left hunt ${huntId}`);
    });

    // Request leaderboard
    socket.on('request-leaderboard', async (huntId: string) => {
      try {
        const participants = await db.participant.findMany({
          where: { huntId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: [
            { score: 'desc' },
            { progress: 'desc' },
          ],
          take: 10, // Top 10
        });

        const leaderboard: LeaderboardEntry[] = participants.map((participant, index) => ({
          userId: participant.userId,
          userName: participant.user.name || participant.user.email,
          score: participant.score,
          progress: participant.progress,
          rank: index + 1,
        }));

        socket.emit('leaderboard-update', { huntId, leaderboard });
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        socket.emit('error', { message: 'Failed to fetch leaderboard' });
      }
    });

    // Handle progress updates
    socket.on('progress-update', async (data: ProgressUpdate) => {
      try {
        const { userId, huntId, clueId, progress, score, status } = data;

        // Update participant progress
        await db.participant.update({
          where: {
            userId_huntId: {
              userId,
              huntId,
            },
          },
          data: {
            progress,
            score,
            status: status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE',
          },
        });

        // Update clue progress
        await db.progress.upsert({
          where: {
            participantId_clueId: {
              participantId: (await db.participant.findUnique({
                where: {
                  userId_huntId: { userId, huntId },
                },
              }))!.id,
              clueId,
            },
          },
          update: {
            status,
            completionTime: status === 'COMPLETED' ? new Date() : null,
          },
          create: {
            participantId: (await db.participant.findUnique({
              where: {
                userId_huntId: { userId, huntId },
              },
            }))!.id,
            clueId,
            status,
            completionTime: status === 'COMPLETED' ? new Date() : null,
          },
        });

        // Broadcast progress update to all users in the hunt
        io.to(`hunt-${huntId}`).emit('progress-update', {
          userId,
          huntId,
          progress,
          score,
          timestamp: new Date().toISOString(),
        });

        // Update and broadcast leaderboard
        const participants = await db.participant.findMany({
          where: { huntId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: [
            { score: 'desc' },
            { progress: 'desc' },
          ],
          take: 10,
        });

        const leaderboard: LeaderboardEntry[] = participants.map((participant, index) => ({
          userId: participant.userId,
          userName: participant.user.name || participant.user.email,
          score: participant.score,
          progress: participant.progress,
          rank: index + 1,
        }));

        io.to(`hunt-${huntId}`).emit('leaderboard-update', { huntId, leaderboard });

        // Check if hunt is completed (100% progress)
        if (progress === 100) {
          // Check if prize is already claimed
          const hunt = await db.hunt.findUnique({
            where: { id: huntId }
          });

          if (hunt && !hunt.prizeClaimed) {
            // Mark prize as claimed and set winner
            await db.hunt.update({
              where: { id: huntId },
              data: {
                prizeClaimed: true,
                winnerId: userId,
                isActive: false // Deactivate hunt since prize is claimed
              }
            });

            // Broadcast hunt completion with prize claimed
            io.to(`hunt-${huntId}`).emit('hunt-completed', {
              userId,
              huntId,
              userName: (await db.user.findUnique({ where: { id: userId } }))?.name || 'Anonymous',
              prizeClaimed: true,
              timestamp: new Date().toISOString(),
            });

            // Broadcast to all users that hunt is over
            io.emit('hunt-ended', {
              huntId,
              winnerId: userId,
              winnerName: (await db.user.findUnique({ where: { id: userId } }))?.name || 'Anonymous',
              timestamp: new Date().toISOString(),
            });
          } else {
            // Just broadcast regular completion (prize already claimed)
            io.to(`hunt-${huntId}`).emit('hunt-completed', {
              userId,
              huntId,
              userName: (await db.user.findUnique({ where: { id: userId } }))?.name || 'Anonymous',
              prizeClaimed: false,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.error('Error handling progress update:', error);
        socket.emit('error', { message: 'Failed to update progress' });
      }
    });

    // Handle chat messages
    socket.on('chat-message', (data: { huntId: string; message: string; userName: string }) => {
      io.to(`hunt-${data.huntId}`).emit('chat-message', {
        userId: socket.id,
        userName: data.userName,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle hints request
    socket.on('request-hint', async (data: { huntId: string; clueId: string; userId: string }) => {
      try {
        // In a real app, you would track hint usage and potentially penalize score
        const hint = `Hint for clue ${data.clueId}: Look for something historical in this location.`;
        
        socket.emit('hint-response', {
          clueId: data.clueId,
          hint,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error providing hint:', error);
        socket.emit('error', { message: 'Failed to provide hint' });
      }
    });

    // Handle location updates
    socket.on('location-update', (data: { huntId: string; userId: string; latitude: number; longitude: number }) => {
      // Broadcast location to other participants (optional, for team coordination)
      socket.to(`hunt-${data.huntId}`).emit('participant-location', {
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle messages (legacy support)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Victoria BC Scavenger Hunt Real-time Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};
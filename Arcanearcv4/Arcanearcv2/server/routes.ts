import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import * as schema from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, desc } from "drizzle-orm";

const JWT_SECRET = process.env.SESSION_SECRET || "arcane-arc-secret-key";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// Middleware to check if user is admin
function requireAdmin(req: any, res: any, next: any) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ====================
  // AUTH ROUTES
  // ====================

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password, fullName } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        fullName,
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Login failed" });
    }
  });

  // ====================
  // USER DASHBOARD ROUTES
  // ====================

  app.get("/api/dashboard", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      const weeks = await storage.getAllWeeks();
      const todayJournal = await storage.getTodayJournal(req.user.id);
      const recentJournals = (await storage.getJournalsByUser(req.user.id)).slice(0, 5);
      const announcements = await storage.getRecentAnnouncements(5);

      // Get user challenges with challenge details
      const userChallenges = await storage.getUserChallengesByUser(req.user.id);
      const activeChallenges = await Promise.all(
        userChallenges.map(async (uc) => {
          const challenge = await storage.getChallenge(uc.challengeId);
          return { ...uc, challenge };
        })
      );

      res.json({
        user,
        weeks,
        todayJournal,
        recentJournals,
        activeChallenges: activeChallenges.filter(ac => ac.challenge),
        announcements,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to load dashboard" });
    }
  });

  // ====================
  // JOURNAL ROUTES
  // ====================

  app.get("/api/journals", authenticateToken, async (req, res) => {
    try {
      const journals = await storage.getJournalsByUser(req.user.id);
      res.json(journals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/journals/today", authenticateToken, async (req, res) => {
    try {
      const journal = await storage.getTodayJournal(req.user.id);
      res.json(journal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/journals", authenticateToken, async (req, res) => {
    try {
      // Check if already journaled today
      const todayJournal = await storage.getTodayJournal(req.user.id);
      if (todayJournal) {
        return res.status(400).json({ message: "You've already journaled today" });
      }

      const journal = await storage.createJournal({
        userId: req.user.id,
        ...req.body,
      });

      // Update user stats
      await storage.incrementUserJournals(req.user.id);
      // Update streak logic can be added here

      res.json(journal);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create journal" });
    }
  });

  // ====================
  // CHALLENGE ROUTES
  // ====================

  app.get("/api/challenges/user", authenticateToken, async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      const weeks = await storage.getAllWeeks();

      const challengesWithStatus = await Promise.all(
        challenges.map(async (challenge) => {
          const userChallenge = await storage.getUserChallenge(req.user.id, challenge.id);
          const week = weeks.find(w => w.id === challenge.weekId);
          return { ...challenge, userChallenge, week };
        })
      );

      res.json(challengesWithStatus);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/challenges/:challengeId/toggle", authenticateToken, async (req, res) => {
    try {
      const { challengeId } = req.params;
      let userChallenge = await storage.getUserChallenge(req.user.id, challengeId);

      if (!userChallenge) {
        // Create new user challenge
        userChallenge = await storage.createUserChallenge({
          userId: req.user.id,
          challengeId,
          completed: true,
        });
        await storage.updateUserChallenge(userChallenge.id, true, new Date());
      } else {
        // Toggle completion
        const newCompleted = !userChallenge.completed;
        await storage.updateUserChallenge(
          userChallenge.id,
          newCompleted,
          newCompleted ? new Date() : null
        );
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // RESOURCES ROUTES
  // ====================

  app.get("/api/resources", authenticateToken, async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // PROFILE ROUTES
  // ====================

  app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      const userAchievements = await storage.getUserAchievements(req.user.id);
      const achievements = await storage.getAllAchievements();

      const achievementsWithDetails = userAchievements.map(ua => {
        const achievement = achievements.find(a => a.id === ua.achievementId);
        return { ...ua, achievement };
      }).filter(a => a.achievement);

      const completedWeeks = await storage.getCompletedWeeksCount(req.user.id);
      const completedChallenges = await storage.getCompletedChallengesCount(req.user.id);

      res.json({
        user,
        achievements: achievementsWithDetails,
        stats: {
          completedWeeks,
          completedChallenges,
          longestStreak: user?.streak || 0,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // WEEKS ROUTES
  // ====================

  app.get("/api/weeks", authenticateToken, async (req, res) => {
    try {
      const weeks = await storage.getAllWeeks();
      res.json(weeks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // ADMIN ROUTES
  // ====================

  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const totalJournals = await storage.getTotalJournalsCount();
      const challenges = await storage.getAllChallenges();

      // Get active users (journaled in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const activeUsers = await storage.getActiveUsers(weekAgo);

      // Calculate average progress
      const avgProgress = users.length > 0
        ? users.reduce((sum, u) => sum + (u.currentWeek / 8) * 100, 0) / users.length
        : 0;

      // Recent activity (last 7 days)
      const recentActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        recentActivity.push({
          date: date.toISOString(),
          journals: 0, // Simplified for MVP
          signups: 0,
        });
      }

      res.json({
        totalUsers: users.length,
        activeUsers: activeUsers.length,
        totalJournals,
        totalChallenges: challenges.length,
        averageProgress: avgProgress,
        recentActivity,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/challenges", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      const weeks = await storage.getAllWeeks();

      const challengesWithWeek = challenges.map(challenge => {
        const week = weeks.find(w => w.id === challenge.weekId);
        return { ...challenge, week };
      });

      res.json(challengesWithWeek);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/challenges", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const challenge = await storage.createChallenge({
        ...req.body,
        createdBy: req.user.id,
      });
      res.json(challenge);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create challenge" });
    }
  });

  app.get("/api/admin/announcements", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/announcements", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const announcement = await storage.createAnnouncement({
        ...req.body,
        createdBy: req.user.id,
      });
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create announcement" });
    }
  });

  app.get("/api/admin/resources", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/resources", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const resource = await storage.createResource({
        ...req.body,
        createdBy: req.user.id,
      });
      res.json(resource);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create resource" });
    }
  });

  // ====================
  // PROFILE UPDATE ROUTES
  // ====================

  app.patch("/api/profile", authenticateToken, async (req, res) => {
    try {
      await storage.updateUserProfile(req.user.id, req.body);
      const updatedUser = await storage.getUser(req.user.id);
      const { password: _, ...userWithoutPassword } = updatedUser!;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update profile" });
    }
  });

  app.get("/api/profile/:userId", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // TASK ROUTES
  // ====================

  app.get("/api/tasks", authenticateToken, async (req, res) => {
    try {
      const tasks = await storage.getTasksAssignedToUser(req.user.id);
      const userSubmissions = await storage.getUserTaskSubmissions(req.user.id);
      
      const tasksWithSubmission = tasks.map(task => {
        const submission = userSubmissions.find(s => s.taskId === task.id);
        return { ...task, submission };
      });
      
      res.json(tasksWithSubmission);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tasks/:taskId/submit", authenticateToken, async (req, res) => {
    try {
      const { taskId } = req.params;
      const { content } = req.body;

      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const existingSubmissions = await storage.getUserTaskSubmissions(req.user.id);
      const existingSubmission = existingSubmissions.find(s => s.taskId === taskId);
      
      if (existingSubmission) {
        return res.status(400).json({ message: "You have already submitted this task" });
      }

      const submission = await storage.createTaskSubmission({
        taskId,
        userId: req.user.id,
        content,
      });

      res.json(submission);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to submit task" });
    }
  });

  app.get("/api/tasks/:taskId/submission", authenticateToken, async (req, res) => {
    try {
      const { taskId } = req.params;
      const userSubmissions = await storage.getUserTaskSubmissions(req.user.id);
      const submission = userSubmissions.find(s => s.taskId === taskId);
      res.json(submission || null);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // MESSAGING ROUTES
  // ====================

  app.get("/api/messages", authenticateToken, async (req, res) => {
    try {
      const messages = await storage.getUserMessages(req.user.id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/messages/:messageId/read", authenticateToken, async (req, res) => {
    try {
      const { messageId } = req.params;
      await storage.markMessageAsRead(messageId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/messages/unread-count", authenticateToken, async (req, res) => {
    try {
      const count = await storage.getUnreadMessagesCount(req.user.id);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ====================
  // ADMIN TASK MANAGEMENT ROUTES
  // ====================

  app.get("/api/admin/tasks", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/tasks", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const task = await storage.createTask({
        ...req.body,
        createdBy: req.user.id,
      });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create task" });
    }
  });

  app.patch("/api/admin/tasks/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateTask(id, req.body);
      const updatedTask = await storage.getTask(id);
      res.json(updatedTask);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update task" });
    }
  });

  app.delete("/api/admin/tasks/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTask(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete task" });
    }
  });

  app.get("/api/admin/tasks/:taskId/submissions", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { taskId } = req.params;
      const submissions = await storage.getTaskSubmissions(taskId);
      
      const submissionsWithUsers = await Promise.all(
        submissions.map(async (submission) => {
          const user = await storage.getUser(submission.userId);
          return { ...submission, user };
        })
      );
      
      res.json(submissionsWithUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/submissions/:id/rate", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, feedback } = req.body;
      
      await storage.updateTaskSubmissionRating(id, rating, feedback, req.user.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to rate submission" });
    }
  });

  // ====================
  // ADMIN MESSAGING ROUTES
  // ====================

  app.post("/api/admin/messages", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { recipientId, subject, content, isGroupMessage, groupFilter } = req.body;
      
      const message = await storage.createMessage({
        senderId: req.user.id,
        recipientId: recipientId || null,
        subject,
        content,
        isGroupMessage: isGroupMessage || false,
        groupFilter: groupFilter || null,
      });
      
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to send message" });
    }
  });

  app.get("/api/admin/messages", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const allMessages = await db.select()
        .from(schema.messages)
        .where(eq(schema.messages.senderId, req.user.id))
        .orderBy(desc(schema.messages.sentAt));
      
      res.json(allMessages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

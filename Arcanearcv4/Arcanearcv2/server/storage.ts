// Referenced from javascript_database blueprint - adapted for Arcane Arc schema
import { db } from "./db";
import { eq, and, desc, gte, count, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Week,
  InsertWeek,
  Challenge,
  InsertChallenge,
  Journal,
  InsertJournal,
  Resource,
  InsertResource,
  Announcement,
  InsertAnnouncement,
  Achievement,
  InsertAchievement,
  UserChallenge,
  InsertUserChallenge,
  UserProgress,
  InsertUserProgress,
  UserAchievement,
  Task,
  InsertTask,
  TaskSubmission,
  InsertTaskSubmission,
  UserTask,
  InsertUserTask,
  Message,
  InsertMessage,
  UpdateProfile,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: string, streak: number): Promise<void>;
  updateUserWeek(userId: string, week: number): Promise<void>;
  incrementUserJournals(userId: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getActiveUsers(since: Date): Promise<User[]>;

  // Weeks
  getAllWeeks(): Promise<Week[]>;
  getWeek(id: string): Promise<Week | undefined>;
  createWeek(week: InsertWeek): Promise<Week>;

  // Challenges
  getAllChallenges(): Promise<Challenge[]>;
  getChallengesByWeek(weekId: string): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;

  // User Challenges
  getUserChallenge(userId: string, challengeId: string): Promise<UserChallenge | undefined>;
  createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge>;
  updateUserChallenge(id: string, completed: boolean, completedAt: Date | null): Promise<void>;
  getUserChallengesByUser(userId: string): Promise<UserChallenge[]>;
  getCompletedChallengesCount(userId: string): Promise<number>;

  // Journals
  getJournalsByUser(userId: string): Promise<Journal[]>;
  getTodayJournal(userId: string): Promise<Journal | null>;
  createJournal(journal: InsertJournal): Promise<Journal>;
  getTotalJournalsCount(): Promise<number>;

  // Resources
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Announcements
  getAllAnnouncements(): Promise<Announcement[]>;
  getRecentAnnouncements(limit: number): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;

  // Achievements
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  addUserAchievement(userId: string, achievementId: string): Promise<UserAchievement>;

  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, completed: boolean, completedAt: Date | null): Promise<void>;
  getCompletedWeeksCount(userId: string): Promise<number>;

  // Profile
  updateUserProfile(userId: string, profile: UpdateProfile): Promise<void>;

  // Tasks
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<void>;
  deleteTask(id: string): Promise<void>;
  getTasksByWeek(weekId: string): Promise<Task[]>;
  getTasksAssignedToUser(userId: string): Promise<Task[]>;

  // Task Submissions
  createTaskSubmission(submission: InsertTaskSubmission): Promise<TaskSubmission>;
  getTaskSubmissions(taskId: string): Promise<TaskSubmission[]>;
  getUserTaskSubmissions(userId: string): Promise<TaskSubmission[]>;
  updateTaskSubmissionRating(id: string, rating: number, feedback: string, reviewedBy: string): Promise<void>;

  // User Tasks
  assignTaskToUser(taskId: string, userId: string): Promise<UserTask>;
  getUserTasks(userId: string): Promise<UserTask[]>;
  updateUserTaskCompletion(id: string, completed: boolean): Promise<void>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: string): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<void>;
  getUnreadMessagesCount(userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    await db.update(schema.users).set({ streak }).where(eq(schema.users.id, userId));
  }

  async updateUserWeek(userId: string, week: number): Promise<void> {
    await db.update(schema.users).set({ currentWeek: week }).where(eq(schema.users.id, userId));
  }

  async incrementUserJournals(userId: string): Promise<void> {
    await db.update(schema.users).set({ totalJournals: sql`${schema.users.totalJournals} + 1` }).where(eq(schema.users.id, userId));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  }

  async getActiveUsers(since: Date): Promise<User[]> {
    const journals = await db.select({ userId: schema.journals.userId })
      .from(schema.journals)
      .where(gte(schema.journals.createdAt, since))
      .groupBy(schema.journals.userId);
    
    const userIds = journals.map(j => j.userId);
    if (userIds.length === 0) return [];

    return await db.select().from(schema.users).where(sql`${schema.users.id} IN (${sql.join(userIds.map(id => sql`${id}`), sql`, `)})`);
  }

  // Weeks
  async getAllWeeks(): Promise<Week[]> {
    return await db.select().from(schema.weeks).orderBy(schema.weeks.weekNumber);
  }

  async getWeek(id: string): Promise<Week | undefined> {
    const [week] = await db.select().from(schema.weeks).where(eq(schema.weeks.id, id));
    return week || undefined;
  }

  async createWeek(week: InsertWeek): Promise<Week> {
    const [created] = await db.insert(schema.weeks).values(week).returning();
    return created;
  }

  // Challenges
  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(schema.challenges).orderBy(desc(schema.challenges.createdAt));
  }

  async getChallengesByWeek(weekId: string): Promise<Challenge[]> {
    return await db.select().from(schema.challenges).where(eq(schema.challenges.weekId, weekId));
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(schema.challenges).where(eq(schema.challenges.id, id));
    return challenge || undefined;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [created] = await db.insert(schema.challenges).values(challenge).returning();
    return created;
  }

  // User Challenges
  async getUserChallenge(userId: string, challengeId: string): Promise<UserChallenge | undefined> {
    const [userChallenge] = await db.select()
      .from(schema.userChallenges)
      .where(and(eq(schema.userChallenges.userId, userId), eq(schema.userChallenges.challengeId, challengeId)));
    return userChallenge || undefined;
  }

  async createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge> {
    const [created] = await db.insert(schema.userChallenges).values(userChallenge).returning();
    return created;
  }

  async updateUserChallenge(id: string, completed: boolean, completedAt: Date | null): Promise<void> {
    await db.update(schema.userChallenges).set({ completed, completedAt }).where(eq(schema.userChallenges.id, id));
  }

  async getUserChallengesByUser(userId: string): Promise<UserChallenge[]> {
    return await db.select().from(schema.userChallenges).where(eq(schema.userChallenges.userId, userId));
  }

  async getCompletedChallengesCount(userId: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(schema.userChallenges)
      .where(and(eq(schema.userChallenges.userId, userId), eq(schema.userChallenges.completed, true)));
    return result[0]?.count || 0;
  }

  // Journals
  async getJournalsByUser(userId: string): Promise<Journal[]> {
    return await db.select().from(schema.journals).where(eq(schema.journals.userId, userId)).orderBy(desc(schema.journals.date));
  }

  async getTodayJournal(userId: string): Promise<Journal | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [journal] = await db.select()
      .from(schema.journals)
      .where(and(
        eq(schema.journals.userId, userId),
        gte(schema.journals.date, today),
        sql`${schema.journals.date} < ${tomorrow}`
      ));
    return journal || null;
  }

  async createJournal(journal: InsertJournal): Promise<Journal> {
    const [created] = await db.insert(schema.journals).values(journal).returning();
    return created;
  }

  async getTotalJournalsCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(schema.journals);
    return result[0]?.count || 0;
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(schema.resources).orderBy(desc(schema.resources.createdAt));
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [created] = await db.insert(schema.resources).values(resource).returning();
    return created;
  }

  // Announcements
  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(schema.announcements).orderBy(desc(schema.announcements.createdAt));
  }

  async getRecentAnnouncements(limit: number): Promise<Announcement[]> {
    return await db.select().from(schema.announcements).orderBy(desc(schema.announcements.createdAt)).limit(limit);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [created] = await db.insert(schema.announcements).values(announcement).returning();
    return created;
  }

  // Achievements
  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(schema.achievements);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [created] = await db.insert(schema.achievements).values(achievement).returning();
    return created;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.select().from(schema.userAchievements).where(eq(schema.userAchievements.userId, userId));
  }

  async addUserAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [created] = await db.insert(schema.userAchievements).values({ userId, achievementId }).returning();
    return created;
  }

  // User Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(schema.userProgress).where(eq(schema.userProgress.userId, userId));
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [created] = await db.insert(schema.userProgress).values(progress).returning();
    return created;
  }

  async updateUserProgress(id: string, completed: boolean, completedAt: Date | null): Promise<void> {
    await db.update(schema.userProgress).set({ completed, completedAt }).where(eq(schema.userProgress.id, id));
  }

  async getCompletedWeeksCount(userId: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(schema.userProgress)
      .where(and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.completed, true)));
    return result[0]?.count || 0;
  }

  // Profile
  async updateUserProfile(userId: string, profile: UpdateProfile): Promise<void> {
    await db.update(schema.users).set(profile).where(eq(schema.users.id, userId));
  }

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(schema.tasks).orderBy(desc(schema.tasks.createdAt));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [created] = await db.insert(schema.tasks).values(task).returning();
    return created;
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<void> {
    await db.update(schema.tasks).set(task).where(eq(schema.tasks.id, id));
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(schema.tasks).where(eq(schema.tasks.id, id));
  }

  async getTasksByWeek(weekId: string): Promise<Task[]> {
    return await db.select().from(schema.tasks).where(eq(schema.tasks.weekId, weekId));
  }

  async getTasksAssignedToUser(userId: string): Promise<Task[]> {
    const userTasks = await db.select()
      .from(schema.userTasks)
      .where(eq(schema.userTasks.userId, userId));
    
    const taskIds = userTasks.map(ut => ut.taskId);
    if (taskIds.length === 0) {
      const allTasks = await db.select().from(schema.tasks).where(eq(schema.tasks.assignedToAll, true));
      return allTasks;
    }

    const assignedTasks = await db.select()
      .from(schema.tasks)
      .where(sql`${schema.tasks.id} IN (${sql.join(taskIds.map(id => sql`${id}`), sql`, `)})`);
    
    const allTasks = await db.select().from(schema.tasks).where(eq(schema.tasks.assignedToAll, true));
    
    const uniqueTasks = new Map();
    [...assignedTasks, ...allTasks].forEach(task => uniqueTasks.set(task.id, task));
    
    return Array.from(uniqueTasks.values());
  }

  // Task Submissions
  async createTaskSubmission(submission: InsertTaskSubmission): Promise<TaskSubmission> {
    const [created] = await db.insert(schema.taskSubmissions).values(submission).returning();
    return created;
  }

  async getTaskSubmissions(taskId: string): Promise<TaskSubmission[]> {
    return await db.select().from(schema.taskSubmissions).where(eq(schema.taskSubmissions.taskId, taskId));
  }

  async getUserTaskSubmissions(userId: string): Promise<TaskSubmission[]> {
    return await db.select().from(schema.taskSubmissions).where(eq(schema.taskSubmissions.userId, userId));
  }

  async updateTaskSubmissionRating(id: string, rating: number, feedback: string, reviewedBy: string): Promise<void> {
    await db.update(schema.taskSubmissions)
      .set({ rating, feedback, reviewedBy, reviewedAt: new Date() })
      .where(eq(schema.taskSubmissions.id, id));
  }

  // User Tasks
  async assignTaskToUser(taskId: string, userId: string): Promise<UserTask> {
    const [created] = await db.insert(schema.userTasks).values({ taskId, userId }).returning();
    return created;
  }

  async getUserTasks(userId: string): Promise<UserTask[]> {
    return await db.select().from(schema.userTasks).where(eq(schema.userTasks.userId, userId));
  }

  async updateUserTaskCompletion(id: string, completed: boolean): Promise<void> {
    await db.update(schema.userTasks)
      .set({ completed, completedAt: completed ? new Date() : null })
      .where(eq(schema.userTasks.id, id));
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(schema.messages).values(message).returning();
    return created;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return await db.select()
      .from(schema.messages)
      .where(eq(schema.messages.recipientId, userId))
      .orderBy(desc(schema.messages.sentAt));
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(schema.messages).set({ readAt: new Date() }).where(eq(schema.messages.id, id));
  }

  async getUnreadMessagesCount(userId: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(schema.messages)
      .where(and(eq(schema.messages.recipientId, userId), sql`${schema.messages.readAt} IS NULL`));
    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();

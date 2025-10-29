import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  currentWeek: integer("current_week").default(1).notNull(), // 1-8
  streak: integer("streak").default(0).notNull(),
  totalJournals: integer("total_journals").default(0).notNull(),
  // Profile information
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  location: text("location"),
  occupation: text("occupation"),
  goals: text("goals"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
});

// Program weeks
export const weeks = pgTable("weeks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekNumber: integer("week_number").notNull().unique(), // 1-8
  title: text("title").notNull(), // e.g., "Self Reflection"
  description: text("description").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  color: text("color").notNull(), // hex color for theme
});

// Challenges
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekId: varchar("week_id").references(() => weeks.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "daily" or "weekly"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
});

// User progress on challenges
export const userChallenges = pgTable("user_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  challengeId: varchar("challenge_id").references(() => challenges.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

// Journal entries
export const journals = pgTable("journals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  achievement: text("achievement"),
  challenge: text("challenge"),
  gratitude: text("gratitude"),
  mood: text("mood"), // "great", "good", "okay", "challenging"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Learning resources
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "Self-Discipline", "Health", "Business", "Mindfulness"
  type: text("type").notNull(), // "video", "pdf", "article"
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
});

// Achievements/Badges
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  criteria: jsonb("criteria").notNull(), // { type: "journals", count: 7 }
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: varchar("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weekId: varchar("week_id").references(() => weeks.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

// Tasks table (admin-created tasks for users)
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  weekId: varchar("week_id").references(() => weeks.id),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  assignedToAll: boolean("assigned_to_all").default(false).notNull(), // If true, assigned to all users
});

// Task submissions (user submissions with admin ratings)
export const taskSubmissions = pgTable("task_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  rating: integer("rating"), // 1-5 star rating
  feedback: text("feedback"), // Admin feedback
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
});

// User task assignments (specific task assignments)
export const userTasks = pgTable("user_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").references(() => tasks.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

// Messages (admin-to-user messaging)
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id), // null for group messages
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  isGroupMessage: boolean("is_group_message").default(false).notNull(),
  groupFilter: text("group_filter"), // JSON string for filtering users (e.g., by week, role, etc.)
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  journals: many(journals),
  userChallenges: many(userChallenges),
  userAchievements: many(userAchievements),
  userProgress: many(userProgress),
  createdChallenges: many(challenges),
  createdResources: many(resources),
  createdAnnouncements: many(announcements),
  createdTasks: many(tasks),
  taskSubmissions: many(taskSubmissions),
  userTasks: many(userTasks),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
}));

export const weeksRelations = relations(weeks, ({ many }) => ({
  challenges: many(challenges),
  userProgress: many(userProgress),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  week: one(weeks, {
    fields: [challenges.weekId],
    references: [weeks.id],
  }),
  createdBy: one(users, {
    fields: [challenges.createdBy],
    references: [users.id],
  }),
  userChallenges: many(userChallenges),
}));

export const journalsRelations = relations(journals, ({ one }) => ({
  user: one(users, {
    fields: [journals.userId],
    references: [users.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  createdBy: one(users, {
    fields: [resources.createdBy],
    references: [users.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  createdBy: one(users, {
    fields: [announcements.createdBy],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userChallenges.userId],
    references: [users.id],
  }),
  challenge: one(challenges, {
    fields: [userChallenges.challengeId],
    references: [challenges.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  week: one(weeks, {
    fields: [userProgress.weekId],
    references: [weeks.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  week: one(weeks, {
    fields: [tasks.weekId],
    references: [weeks.id],
  }),
  createdBy: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
  taskSubmissions: many(taskSubmissions),
  userTasks: many(userTasks),
}));

export const taskSubmissionsRelations = relations(taskSubmissions, ({ one }) => ({
  task: one(tasks, {
    fields: [taskSubmissions.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskSubmissions.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [taskSubmissions.reviewedBy],
    references: [users.id],
  }),
}));

export const userTasksRelations = relations(userTasks, ({ one }) => ({
  task: one(tasks, {
    fields: [userTasks.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [userTasks.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  fullName: true,
});

export const insertWeekSchema = createInsertSchema(weeks).omit({
  id: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export const insertJournalSchema = createInsertSchema(journals).omit({
  id: true,
  createdAt: true,
  date: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({
  id: true,
  completedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSubmissionSchema = createInsertSchema(taskSubmissions).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertUserTaskSchema = createInsertSchema(userTasks).omit({
  id: true,
  assignedAt: true,
  completedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
  readAt: true,
});

export const updateProfileSchema = createInsertSchema(users).pick({
  fullName: true,
  bio: true,
  phone: true,
  dateOfBirth: true,
  location: true,
  occupation: true,
  goals: true,
  emergencyContact: true,
  emergencyPhone: true,
  profilePicture: true,
}).partial();

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Week = typeof weeks.$inferSelect;
export type InsertWeek = z.infer<typeof insertWeekSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Journal = typeof journals.$inferSelect;
export type InsertJournal = z.infer<typeof insertJournalSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type TaskSubmission = typeof taskSubmissions.$inferSelect;
export type InsertTaskSubmission = z.infer<typeof insertTaskSubmissionSchema>;
export type UserTask = typeof userTasks.$inferSelect;
export type InsertUserTask = z.infer<typeof insertUserTaskSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

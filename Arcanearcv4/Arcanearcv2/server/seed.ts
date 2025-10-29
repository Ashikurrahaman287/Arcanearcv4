import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const [admin] = await db.insert(schema.users).values({
      username: "admin",
      email: "admin@arcanearc.com",
      password: hashedPassword,
      fullName: "Admin User",
      role: "admin",
    }).onConflictDoNothing().returning();

    console.log("✅ Admin user created:", admin?.username || "already exists");

    // Create test users
    const testUserPassword = await bcrypt.hash("user123", 10);
    const testUsers = [
      {
        username: "testuser1",
        email: "test1@example.com",
        password: testUserPassword,
        fullName: "John Doe",
        role: "user",
        bio: "Excited to start my transformation journey!",
        currentWeek: 1,
        streak: 3,
        totalJournals: 5,
      },
      {
        username: "testuser2",
        email: "test2@example.com",
        password: testUserPassword,
        fullName: "Jane Smith",
        role: "user",
        bio: "Ready to build better habits this winter.",
        currentWeek: 2,
        streak: 7,
        totalJournals: 10,
      },
    ];

    for (const user of testUsers) {
      await db.insert(schema.users).values(user).onConflictDoNothing();
    }

    console.log("✅ Test users created (username: testuser1, testuser2, password: user123)");

    // Create 8 weeks
    const weekData = [
      {
        weekNumber: 1,
        title: "Self Reflection",
        description: "Begin your journey with deep self-discovery and understanding your current state.",
        icon: "Target",
        color: "#FFD700",
      },
      {
        weekNumber: 2,
        title: "Skill Growth",
        description: "Identify skills you want to develop and create a learning roadmap.",
        icon: "BookOpen",
        color: "#4DD0E1",
      },
      {
        weekNumber: 3,
        title: "Physical Health",
        description: "Build sustainable fitness habits and optimize your physical well-being.",
        icon: "Dumbbell",
        color: "#7C4DFF",
      },
      {
        weekNumber: 4,
        title: "Mind & Spirit",
        description: "Cultivate mental clarity through mindfulness and spiritual practices.",
        icon: "Brain",
        color: "#AB47BC",
      },
      {
        weekNumber: 5,
        title: "Knowledge Expansion",
        description: "Broaden your horizons with new ideas, books, and perspectives.",
        icon: "Sparkles",
        color: "#FF7043",
      },
      {
        weekNumber: 6,
        title: "Career Growth",
        description: "Advance your professional goals and clarify your career vision.",
        icon: "Briefcase",
        color: "#FFD700",
      },
      {
        weekNumber: 7,
        title: "Relationships",
        description: "Strengthen connections and build meaningful relationships.",
        icon: "Heart",
        color: "#4DD0E1",
      },
      {
        weekNumber: 8,
        title: "Integration & Celebration",
        description: "Integrate all learnings and celebrate your transformation.",
        icon: "Trophy",
        color: "#FFD700",
      },
    ];

    for (const week of weekData) {
      await db.insert(schema.weeks).values(week).onConflictDoNothing();
    }

    console.log("✅ 8 weeks created");

    // Create sample challenges for week 1
    const [week1] = await db.select().from(schema.weeks).where(eq(schema.weeks.weekNumber, 1));

    if (week1 && admin) {
      const challengeData = [
        {
          weekId: week1.id,
          title: "Complete your self-assessment",
          description: "Take 30 minutes to honestly evaluate your current state across all life areas.",
          type: "daily",
          createdBy: admin.id,
        },
        {
          weekId: week1.id,
          title: "Define your core values",
          description: "List your top 5 core values that will guide your transformation journey.",
          type: "daily",
          createdBy: admin.id,
        },
        {
          weekId: week1.id,
          title: "Set 8-week goals",
          description: "Write down 3-5 specific, measurable goals you want to achieve by the end of the program.",
          type: "weekly",
          createdBy: admin.id,
        },
      ];

      for (const challenge of challengeData) {
        await db.insert(schema.challenges).values(challenge).onConflictDoNothing();
      }

      console.log("✅ Sample challenges created for Week 1");
    }

    // Create sample resources
    const resourceData = [
      {
        title: "Atomic Habits by James Clear",
        description: "Learn how tiny changes can lead to remarkable results in building better habits.",
        category: "Self-Discipline",
        type: "article",
        url: "https://jamesclear.com/atomic-habits",
        createdBy: admin?.id || "",
      },
      {
        title: "The Power of Now by Eckhart Tolle",
        description: "A guide to spiritual enlightenment and living in the present moment.",
        category: "Mindfulness",
        type: "article",
        url: "https://www.eckharttolle.com/the-power-of-now/",
        createdBy: admin?.id || "",
      },
      {
        title: "Fitness Fundamentals",
        description: "A comprehensive guide to building a sustainable exercise routine.",
        category: "Health",
        type: "video",
        url: "https://www.youtube.com/watch?v=example",
        createdBy: admin?.id || "",
      },
    ];

    if (admin) {
      for (const resource of resourceData) {
        await db.insert(schema.resources).values(resource).onConflictDoNothing();
      }
      console.log("✅ Sample resources created");
    }

    // Create welcome announcement
    if (admin) {
      await db.insert(schema.announcements).values({
        title: "Welcome to Arcane Arc! ❄️",
        content: "Your transformation journey begins today. Remember to journal daily, complete your weekly challenges, and connect with the community. We're here to support you every step of the way!",
        createdBy: admin.id,
      }).onConflictDoNothing();

      console.log("✅ Welcome announcement created");
    }

    // Create sample tasks
    if (admin && week1) {
      const [task1] = await db.insert(schema.tasks).values({
        title: "Complete Your Personal Assessment",
        description: "Take time to reflect on your current state in all life areas. This will help you track your progress throughout the program.",
        weekId: week1.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: admin.id,
        assignedToAll: true,
      }).onConflictDoNothing().returning();

      console.log("✅ Sample tasks created");
    }

    // Create sample welcome messages
    if (admin) {
      const users = await db.select().from(schema.users).where(eq(schema.users.role, "user"));
      
      for (const user of users) {
        await db.insert(schema.messages).values({
          senderId: admin.id,
          recipientId: user.id,
          subject: "Welcome to Your Transformation Journey!",
          content: `Hi ${user.fullName},\n\nWelcome to Arcane Arc! We're excited to have you join us on this 8-week transformation journey.\n\nYour admin team is here to support you every step of the way. Feel free to reach out if you have any questions.\n\nLet's make this winter count!\n\nBest regards,\nThe Arcane Arc Team`,
        }).onConflictDoNothing();
      }

      console.log("✅ Welcome messages sent to all users");
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { prisma } from "../lib/prisma";

import { v4 as uuidv4 } from "uuid";

// ==================== ADMIN SEED ====================
async function seedAdmin() {
  try {
    console.log("***** Admin Seeding Started....");

    const adminData = {
      name: "Adnan Admin",
      email: "adnan@admin.com",
      password: "12345678",
      role: "ADMIN",
    };

    console.log("***** Checking if Admin exists");
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingAdmin) {
      console.log("   Admin already exists, skipping...");
      return;
    }

    const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:3000"
      },
      body: JSON.stringify(adminData),
    });

    if (signUpAdmin.ok) {
      console.log("  Admin created successfully");
      
      // Update admin role and email verification
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          role: "ADMIN",
          emailVerified: true,
        },
      });

      console.log("  Admin role and email verification updated!");
    } else {
      console.error("  Failed to create admin:", await signUpAdmin.text());
    }
  } catch (error) {
    console.error("  Admin seeding error:", error);
  }
}

// ==================== CATEGORY SEED ====================
async function seedCategories() {
  try {
    console.log("\n***** Category Seeding Started....");

    const categories = [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Geography",
      "Computer Science",
      "Economics",
      "Psychology",
      "Web Development",
      "Mobile Development",
    ];

    for (const categoryName of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: {
          name: categoryName,
        },
      });

      if (existingCategory) {
        console.log(`   Category "${categoryName}" already exists, skipping...`);
        continue;
      }

      const category = await prisma.category.create({
        data: {
          id: uuidv4(),
          name: categoryName,
        },
      });

      console.log(`  Category created: ${category.name}`);
    }

    console.log("******* Category Seeding SUCCESS *******\n");
  } catch (error) {
    console.error("  Category seeding error:", error);
  }
}

// ==================== USER SEED ====================
async function seedUsers() {
  try {
    console.log("***** User Seeding Started....");

    const dummyUsers = [
      {
        name: "John Student",
        email: "john.student@example.com",
        role: "STUDENT"
      },
      {
        name: "Sarah Student",
        email: "sarah.student@example.com",
        role: "STUDENT"
      },
      {
        name: "Mike Student",
        email: "mike.student@example.com",
        role: "STUDENT"
      },
      {
        name: "Emma Student",
        email: "emma.student@example.com",
        role: "STUDENT"
      },
      {
        name: "David Student",
        email: "david.student@example.com",
        role: "STUDENT"
      },
    ];

    for (const userData of dummyUsers) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: userData.email,
        },
      });

      if (existingUser) {
        console.log(`   User "${userData.email}" already exists, skipping...`);
        continue;
      }

      const signUpUser = await fetch("http://localhost:5000/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000"
        },
        body: JSON.stringify({
          ...userData,
          password: "password123",
          role: "STUDENT",
        }),
      });

      if (signUpUser.ok) {
        // Update email verification
        await prisma.user.update({
          where: {
            email: userData.email,
          },
          data: {
            emailVerified: true,
          },
        });
        console.log(`  User created: ${userData.name} (${userData.email})`);
      } else {
        console.error(`  Failed to create user ${userData.email}:`, await signUpUser.text());
      }
    }

    console.log("******* Student User Seeding SUCCESS *******\n");
  } catch (error) {
    console.error("  User seeding error:", error);
  }
}

// ==================== TUTOR USER SEED ====================
async function seedTutorUsers() {
  try {
    console.log("***** Tutor User Seeding Started....");

    const dummyTutors = [
      {
        name: "Dr. James Math Tutor",
        email: "james.tutor@example.com",
        phone: "+9111111111",
        bio: "Experienced Mathematics tutor with 10+ years of teaching",
        price: 50.0,
        experience: 10,
        categories: ["Mathematics"],
      },
      {
        name: "Prof. Alice Physics",
        email: "alice.tutor@example.com",
        phone: "+9222222222",
        bio: "Expert Physics teacher specializing in advanced topics",
        price: 60.0,
        experience: 12,
        categories: ["Physics"],
      },
      {
        name: "Mr. Robert Chemistry",
        email: "robert.tutor@example.com",
        phone: "+9333333333",
        bio: "Chemistry enthusiast with practical lab experience",
        price: 45.0,
        experience: 8,
        categories: ["Chemistry", "Biology"],
      },
      {
        name: "Ms. Lisa English",
        email: "lisa.tutor@example.com",
        phone: "+9444444444",
        bio: "Native English speaker, specializing in literature",
        price: 40.0,
        experience: 7,
        categories: ["English"],
      },
      {
        name: "Dev. CodeMaster",
        email: "code.tutor@example.com",
        phone: "+9555555555",
        bio: "Full-stack developer teaching web and mobile development",
        price: 75.0,
        experience: 6,
        categories: ["Web Development", "Computer Science"],
      },
    ];

    for (const tutorData of dummyTutors) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: tutorData.email,
        },
      });

      if (existingUser) {
        console.log(`   Tutor "${tutorData.email}" already exists, skipping...`);
        continue;
      }

      const signUpTutor = await fetch("http://localhost:5000/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000"
        },
        body: JSON.stringify({
          name: tutorData.name,
          email: tutorData.email,
          password: "password123",
          role: "TUTOR",
        }),
      });

      if (signUpTutor.ok) {
        // Update email verification and get the user
        const user = await prisma.user.update({
          where: {
            email: tutorData.email,
          },
          data: {
            emailVerified: true,
            phone: tutorData.phone,
          },
        });

        // Get categories
        const categories = await prisma.category.findMany({
          where: {
            name: {
              in: tutorData.categories,
            },
          },
        });

        // Create tutor profile
        await prisma.tutorProfile.create({
          data: {
            id: uuidv4(),
            userId: user.id,
            bio: tutorData.bio,
            price: tutorData.price,
            experience: tutorData.experience,
            isFeatured: Math.random() > 0.5,
            categories: {
              connect: categories.map((cat) => ({ id: cat.id })),
            },
          },
        });

        console.log(`  Tutor created: ${tutorData.name} (${tutorData.email})`);
      } else {
        console.error(`  Failed to create tutor ${tutorData.email}:`, await signUpTutor.text());
      }
    }

    console.log("******* Tutor User Seeding SUCCESS *******\n");
  } catch (error) {
    console.error("  Tutor seeding error:", error);
  }
}

// ==================== MAIN SEED FUNCTION ====================
async function main() {
  try {
    console.log("\n  Starting Database Seeding...\n");

    await seedAdmin();
    await seedCategories();
    await seedUsers();
    await seedTutorUsers();

    console.log("\n  All seeding completed successfully!\n");
  } catch (error) {
    console.error("  Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
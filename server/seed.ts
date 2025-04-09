import { db } from "./db";
import {
  users,
  categories,
  courses,
  sections,
  lessons,
  enrollments,
  reviews,
  orders,
  userLessonProgress
} from "@shared/schema";

async function seedDatabase() {
  console.log("Starting seed database process...");

  // Clear all existing data
  try {
    console.log("Clearing existing data...");
    await db.delete(userLessonProgress);
    await db.delete(orders);
    await db.delete(reviews);
    await db.delete(enrollments);
    await db.delete(lessons);
    await db.delete(sections);
    await db.delete(courses);
    await db.delete(categories);
    await db.delete(users);
    console.log("All existing data cleared.");
  } catch (error) {
    console.error("Error clearing data:", error);
  }

  try {
    // Create users
    console.log("Creating users...");
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: "admin123",
      email: "admin@example.com",
      fullName: "Administrator",
      role: "admin",
      isActive: true,
      avatar: null,
      bio: "System administrator",
    }).returning();

    const [studentUser] = await db.insert(users).values({
      username: "student",
      password: "student123",
      email: "student@example.com",
      fullName: "John Student",
      role: "student",
      isActive: true,
      avatar: null,
      bio: "Regular student account",
    }).returning();

    const [instructorUser] = await db.insert(users).values({
      username: "instructor",
      password: "instructor123",
      email: "instructor@example.com",
      fullName: "Jane Instructor",
      role: "instructor",
      isActive: true,
      avatar: null,
      bio: "Experienced instructor with 5+ years of teaching experience",
    }).returning();
    console.log("Users created:", { adminUser, studentUser, instructorUser });

    // Create categories
    console.log("Creating categories...");
    const categoriesData = [
      {
        name: "Web Development",
        slug: "web-development",
        description: "Learn how to build modern web applications",
        icon: "fa-code",
      },
      {
        name: "Mobile Development",
        slug: "mobile-development",
        description: "Create apps for iOS and Android",
        icon: "fa-mobile",
      },
      {
        name: "Data Science",
        slug: "data-science",
        description: "Master data analysis and machine learning",
        icon: "fa-chart-pie",
      },
      {
        name: "Design",
        slug: "design",
        description: "UI/UX design principles and tools",
        icon: "fa-palette",
      },
      {
        name: "Business",
        slug: "business",
        description: "Entrepreneurship and business skills",
        icon: "fa-briefcase",
      },
      {
        name: "Marketing",
        slug: "marketing",
        description: "Digital marketing strategies",
        icon: "fa-bullhorn",
      },
    ];

    const createdCategories = [];
    for (const category of categoriesData) {
      const [createdCategory] = await db.insert(categories).values(category).returning();
      createdCategories.push(createdCategory);
    }
    console.log("Categories created:", createdCategories);

    // Create courses
    console.log("Creating courses...");
    const coursesData = [
      {
        title: "Complete React Developer Course",
        slug: "complete-react-developer",
        description: "Learn React from scratch and build real-world applications. This course covers hooks, context API, Redux, and more.",
        price: 6900,
        originalPrice: 12900,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
        previewVideo: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        level: "intermediate",
        categoryId: createdCategories[0].id,
        instructorId: instructorUser.id,
        isPublished: true,
        isApproved: true,
        isFeatured: true,
        isPopular: true,
        totalHours: 14.5,
      },
      {
        title: "The Complete Node.js Developer Course",
        slug: "complete-nodejs-developer",
        description: "Build and deploy Node.js applications. Learn server-side JavaScript with Express, MongoDB, and more.",
        price: 5900,
        originalPrice: 9900,
        thumbnail: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=2070&auto=format&fit=crop",
        previewVideo: null,
        level: "beginner",
        categoryId: createdCategories[0].id,
        instructorId: instructorUser.id,
        isPublished: true,
        isApproved: true,
        isFeatured: true,
        isPopular: false,
        totalHours: 18.5,
      },
      {
        title: "Flutter & Dart: The Complete Guide",
        slug: "flutter-dart-complete-guide",
        description: "Build beautiful native mobile apps for iOS and Android with Flutter and Dart.",
        price: 7900,
        originalPrice: 14900,
        thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop",
        previewVideo: null,
        level: "intermediate",
        categoryId: createdCategories[1].id,
        instructorId: instructorUser.id,
        isPublished: true,
        isApproved: true,
        isFeatured: false,
        isPopular: true,
        totalHours: 22.0,
      },
      {
        title: "Machine Learning A-Z",
        slug: "machine-learning-a-z",
        description: "Master machine learning algorithms with Python and R. From linear regression to deep learning.",
        price: 8900,
        originalPrice: 16900,
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
        previewVideo: null,
        level: "advanced",
        categoryId: createdCategories[2].id,
        instructorId: instructorUser.id,
        isPublished: true,
        isApproved: true,
        isFeatured: true,
        isPopular: true,
        totalHours: 28.5,
      },
      {
        title: "UI/UX Design Masterclass",
        slug: "ui-ux-design-masterclass",
        description: "Create beautiful user interfaces and exceptional user experiences. Learn Figma, design principles, and more.",
        price: 5900,
        originalPrice: 11900,
        thumbnail: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=2071&auto=format&fit=crop",
        previewVideo: null,
        level: "beginner",
        categoryId: createdCategories[3].id,
        instructorId: instructorUser.id,
        isPublished: true,
        isApproved: true,
        isFeatured: false,
        isPopular: false,
        totalHours: 16.0,
      },
      {
        title: "Digital Marketing Bootcamp",
        slug: "digital-marketing-bootcamp",
        description: "Master digital marketing strategies including SEO, social media, email marketing, and paid advertising.",
        price: 4900,
        originalPrice: 8900,
        thumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=206&auto=format&fit=crop",
        previewVideo: null,
        level: "beginner",
        categoryId: createdCategories[5].id,
        instructorId: instructorUser.id,
        isPublished: true,
        isApproved: true,
        isFeatured: false,
        isPopular: false,
        totalHours: 12.5,
      },
    ];

    const createdCourses = [];
    for (const course of coursesData) {
      const [createdCourse] = await db.insert(courses).values(course).returning();
      createdCourses.push(createdCourse);
    }
    console.log("Courses created:", createdCourses);

    // Create sections and lessons
    console.log("Creating sections and lessons...");
    for (const course of createdCourses) {
      // Create 3-5 sections per course
      const sectionCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < sectionCount; i++) {
        const [section] = await db.insert(sections).values({
          title: `Section ${i + 1}: ${['Introduction', 'Fundamentals', 'Advanced Topics', 'Projects', 'Bonus Content'][i % 5]}`,
          description: `This section covers ${['basic concepts', 'core functionalities', 'advanced techniques', 'real-world applications', 'additional resources'][i % 5]}.`,
          courseId: course.id,
          order: i,
        }).returning();

        // Create 3-7 lessons per section
        const lessonCount = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < lessonCount; j++) {
          await db.insert(lessons).values({
            title: `Lesson ${j + 1}: ${['Overview', 'Getting Started', 'Core Concepts', 'Implementation', 'Best Practices', 'Tips and Tricks', 'Case Study'][j % 7]}`,
            description: `This lesson explains ${['the fundamentals', 'how to implement', 'best practices for', 'common issues with', 'optimizing'][j % 5]} ${course.title.split(' ').slice(1, 3).join(' ')}.`,
            content: "Lesson content goes here. This would typically contain text, code samples, or embedded resources.",
            videoUrl: j === 0 ? "https://www.youtube.com/watch?v=example" : null,
            duration: 600 + Math.floor(Math.random() * 1200), // 10-30 minutes in seconds
            isFree: j === 0, // First lesson is free
            sectionId: section.id,
            courseId: course.id,
            order: j,
          });
        }
      }
    }
    console.log("Sections and lessons created");

    // Create enrollments
    console.log("Creating enrollments...");
    // Student is enrolled in the first 3 courses
    for (let i = 0; i < 3; i++) {
      const course = createdCourses[i];
      await db.insert(enrollments).values({
        userId: studentUser.id,
        courseId: course.id,
        price: course.price,
        progress: Math.floor(Math.random() * 101), // 0-100%
        completed: Math.random() > 0.7,
      });

      // Create an order for each enrollment
      await db.insert(orders).values({
        userId: studentUser.id,
        courseId: course.id,
        amount: course.price,
        status: "completed",
      });
    }

    // Create some reviews
    console.log("Creating reviews...");
    const reviewsData = [
      {
        userId: studentUser.id,
        courseId: createdCourses[0].id,
        rating: 5,
        content: "Excellent course! The instructor explains concepts clearly and the projects are very practical.",
      },
      {
        userId: studentUser.id,
        courseId: createdCourses[1].id,
        rating: 4,
        content: "Very good content. Would have liked more examples, but overall a solid course.",
      },
      {
        userId: studentUser.id,
        courseId: createdCourses[2].id,
        rating: 5,
        content: "This course exceeded my expectations. I learned so much and now feel confident building apps.",
      },
    ];

    for (const review of reviewsData) {
      await db.insert(reviews).values(review);
    }

    // Update course ratings based on reviews
    for (const course of createdCourses.slice(0, 3)) {
      const [result] = await db
        .select({
          avgRating: db.fn.avg(reviews.rating).as("avgRating"),
          count: db.fn.count().as("count"),
        })
        .from(reviews)
        .where(db.eq(reviews.courseId, course.id));
      
      const avgRating = Number(result?.avgRating) || 0;
      const totalRatings = Number(result?.count) || 0;
      
      await db
        .update(courses)
        .set({ 
          averageRating: avgRating, 
          totalRatings: totalRatings,
        })
        .where(db.eq(courses.id, course.id));
    }

    // Create lesson progress
    console.log("Creating lesson progress...");
    const firstCourse = createdCourses[0];
    const firstSectionLessons = await db
      .select()
      .from(lessons)
      .where(db.and(
        db.eq(lessons.courseId, firstCourse.id),
        db.eq(lessons.order, 0)
      ));

    if (firstSectionLessons.length > 0) {
      // Mark a few lessons as completed
      for (let i = 0; i < Math.min(3, firstSectionLessons.length); i++) {
        await db.insert(userLessonProgress).values({
          userId: studentUser.id,
          lessonId: firstSectionLessons[i].id,
          courseId: firstCourse.id,
          completed: i < 2, // First 2 lessons completed
          lastWatched: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000), // Watched in the last month
          watchedSeconds: firstSectionLessons[i].duration * (i === 2 ? 0.7 : 1), // Last one partially watched
        });
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("Seed process complete, exiting...");
  process.exit(0);
}).catch(error => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
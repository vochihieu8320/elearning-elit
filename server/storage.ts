import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  courses, type Course, type InsertCourse,
  sections, type Section, type InsertSection, 
  lessons, type Lesson, type InsertLesson,
  enrollments, type Enrollment, type InsertEnrollment,
  reviews, type Review, type InsertReview,
  userLessonProgress, type UserLessonProgress, type InsertUserLessonProgress,
  orders, type Order, type InsertOrder
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, sql, count, sum, not, gte, lte, or, asc, isNotNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

// Interface for the storage
import session from "express-session";
import memorystore from "memorystore";

export interface IStorage {
  sessionStore: session.Store;
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStatus(id: number, isActive: boolean): Promise<User>;
  getUsers(options: { 
    page: number;
    limit: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number }>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Courses
  getAllCourses(): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  getLatestCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  incrementCourseStudents(courseId: number): Promise<void>;
  getAdminCourses(options: {
    page: number;
    limit: number;
    search?: string;
    isApproved?: boolean;
    isPublished?: boolean;
  }): Promise<{ courses: Course[]; total: number }>;

  // Sections and Lessons
  getCourseSections(courseId: number): Promise<Section[]>;
  
  // Reviews
  getCourseReviews(courseId: number): Promise<Review[]>;
  getUserCourseReview(userId: number, courseId: number): Promise<Review | undefined>;
  getUserReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Enrollments
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  getUserCourseEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;

  // Progress
  getUserRecentProgress(userId: number): Promise<any[]>;
  
  // Orders
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  getRecentOrders(): Promise<Order[]>;

  // Admin stats
  getAdminStats(): Promise<{
    usersCount: number;
    coursesCount: number;
    ordersCount: number;
    revenue: number;
    usersChange: number;
    coursesChange: number;
    ordersChange: number;
    revenueChange: number;
  }>;
  getRevenueByMonth(year: number): Promise<{ name: string; value: number }[]>;

  // Testimonials
  getTestimonials(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private categoryStore: Map<number, Category>;
  private courseStore: Map<number, Course>;
  private sectionStore: Map<number, Section>;
  private lessonStore: Map<number, Lesson>;
  private enrollmentStore: Map<number, Enrollment>;
  private reviewStore: Map<number, Review>;
  private progressStore: Map<number, UserLessonProgress>;
  private orderStore: Map<number, Order>;
  
  private nextUserId: number;
  private nextCategoryId: number;
  private nextCourseId: number;
  private nextSectionId: number;
  private nextLessonId: number;
  private nextEnrollmentId: number;
  private nextReviewId: number;
  private nextProgressId: number;
  private nextOrderId: number;

  sessionStore: session.Store;

  constructor() {
    // Create memory store for sessions
    const MemoryStore = memorystore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    this.userStore = new Map();
    this.categoryStore = new Map();
    this.courseStore = new Map();
    this.sectionStore = new Map();
    this.lessonStore = new Map();
    this.enrollmentStore = new Map();
    this.reviewStore = new Map();
    this.progressStore = new Map();
    this.orderStore = new Map();

    this.nextUserId = 1;
    this.nextCategoryId = 1;
    this.nextCourseId = 1;
    this.nextSectionId = 1;
    this.nextLessonId = 1;
    this.nextEnrollmentId = 1;
    this.nextReviewId = 1;
    this.nextProgressId = 1;
    this.nextOrderId = 1;

    // Initialize with some sample data
    this.seedData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.userStore.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Check if username already exists
    const existingUser = await this.getUserByUsername(userData.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const id = this.nextUserId++;
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      role: userData.role || "student",
      isActive: true,
      createdAt: now,
    };

    this.userStore.set(id, user);
    return user;
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      isActive
    };

    this.userStore.set(id, updatedUser);
    return updatedUser;
  }

  async getUsers(options: { 
    page: number;
    limit: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number }> {
    const { page, limit, search, role, isActive } = options;
    
    let filteredUsers = Array.from(this.userStore.values());
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (typeof isActive === 'boolean') {
      filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
    }
    
    // Sort by newest first
    filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    return {
      users: paginatedUsers,
      total: filteredUsers.length
    };
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoryStore.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoryStore.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    for (const category of this.categoryStore.values()) {
      if (category.slug === slug) {
        return category;
      }
    }
    return undefined;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.nextCategoryId++;
    const category: Category = {
      ...categoryData,
      id
    };

    this.categoryStore.set(id, category);
    return category;
  }

  // Courses
  async getAllCourses(): Promise<Course[]> {
    // Only return published and approved courses
    return Array.from(this.courseStore.values())
      .filter(course => course.isPublished && course.isApproved);
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courseStore.values())
      .filter(course => course.isPublished && course.isApproved && course.isFeatured)
      .slice(0, 6); // Return at most 6 featured courses
  }

  async getLatestCourses(): Promise<Course[]> {
    return Array.from(this.courseStore.values())
      .filter(course => course.isPublished && course.isApproved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8); // Return at most 8 latest courses
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courseStore.get(id);
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    for (const course of this.courseStore.values()) {
      if (course.slug === slug) {
        return course;
      }
    }
    return undefined;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const id = this.nextCourseId++;
    const now = new Date();
    const course: Course = {
      ...courseData,
      id,
      totalStudents: 0,
      totalRatings: 0,
      averageRating: 0,
      createdAt: now,
      updatedAt: now
    };

    this.courseStore.set(id, course);
    return course;
  }

  async updateCourse(id: number, courseData: Partial<InsertCourse>): Promise<Course> {
    const course = await this.getCourse(id);
    if (!course) {
      throw new Error("Course not found");
    }

    const now = new Date();
    const updatedCourse: Course = {
      ...course,
      ...courseData,
      updatedAt: now
    };

    this.courseStore.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    // Check if course exists
    const course = await this.getCourse(id);
    if (!course) {
      throw new Error("Course not found");
    }

    // Delete the course
    this.courseStore.delete(id);

    // Delete related sections and lessons
    const sections = await this.getCourseSections(id);
    for (const section of sections) {
      this.sectionStore.delete(section.id);
      // Delete lessons in this section
      for (const lesson of this.getLessonsBySection(section.id)) {
        this.lessonStore.delete(lesson.id);
      }
    }

    // Delete enrollments for this course
    for (const enrollment of this.enrollmentStore.values()) {
      if (enrollment.courseId === id) {
        this.enrollmentStore.delete(enrollment.id);
      }
    }

    // Delete reviews for this course
    for (const review of this.reviewStore.values()) {
      if (review.courseId === id) {
        this.reviewStore.delete(review.id);
      }
    }
  }

  async incrementCourseStudents(courseId: number): Promise<void> {
    const course = await this.getCourse(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const updatedCourse: Course = {
      ...course,
      totalStudents: course.totalStudents + 1
    };

    this.courseStore.set(courseId, updatedCourse);
  }

  async getAdminCourses(options: {
    page: number;
    limit: number;
    search?: string;
    isApproved?: boolean;
    isPublished?: boolean;
  }): Promise<{ courses: Course[]; total: number }> {
    const { page, limit, search, isApproved, isPublished } = options;
    
    let filteredCourses = Array.from(this.courseStore.values());
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (typeof isApproved === 'boolean') {
      filteredCourses = filteredCourses.filter(course => course.isApproved === isApproved);
    }
    
    if (typeof isPublished === 'boolean') {
      filteredCourses = filteredCourses.filter(course => course.isPublished === isPublished);
    }
    
    // Sort by newest first
    filteredCourses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedCourses = filteredCourses.slice(start, end);
    
    return {
      courses: paginatedCourses,
      total: filteredCourses.length
    };
  }

  // Sections and Lessons
  async getCourseSections(courseId: number): Promise<Section[]> {
    const sections = Array.from(this.sectionStore.values())
      .filter(section => section.courseId === courseId)
      .sort((a, b) => a.order - b.order);
    
    // Attach lessons to each section
    return sections.map(section => {
      const sectionLessons = this.getLessonsBySection(section.id)
        .sort((a, b) => a.order - b.order);
      
      return {
        ...section,
        lessons: sectionLessons
      };
    });
  }

  private getLessonsBySection(sectionId: number): Lesson[] {
    return Array.from(this.lessonStore.values())
      .filter(lesson => lesson.sectionId === sectionId);
  }

  // Reviews
  async getCourseReviews(courseId: number): Promise<Review[]> {
    return Array.from(this.reviewStore.values())
      .filter(review => review.courseId === courseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUserCourseReview(userId: number, courseId: number): Promise<Review | undefined> {
    for (const review of this.reviewStore.values()) {
      if (review.userId === userId && review.courseId === courseId) {
        return review;
      }
    }
    return undefined;
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviewStore.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.nextReviewId++;
    const now = new Date();
    const review: Review = {
      ...reviewData,
      id,
      createdAt: now
    };

    this.reviewStore.set(id, review);

    // Update course rating
    await this.updateCourseRating(reviewData.courseId);

    return review;
  }

  private async updateCourseRating(courseId: number): Promise<void> {
    const course = await this.getCourse(courseId);
    if (!course) {
      return;
    }

    const reviews = await this.getCourseReviews(courseId);
    const totalRatings = reviews.length;
    
    if (totalRatings === 0) {
      return;
    }

    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRatings / totalRatings;

    const updatedCourse: Course = {
      ...course,
      totalRatings,
      averageRating
    };

    this.courseStore.set(courseId, updatedCourse);
  }

  // Enrollments
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    const enrollments = Array.from(this.enrollmentStore.values())
      .filter(enrollment => enrollment.userId === userId)
      .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());
    
    // Attach course data to each enrollment
    return enrollments.map(enrollment => {
      const course = this.courseStore.get(enrollment.courseId);
      return {
        ...enrollment,
        course
      };
    });
  }

  async getUserCourseEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    for (const enrollment of this.enrollmentStore.values()) {
      if (enrollment.userId === userId && enrollment.courseId === courseId) {
        return enrollment;
      }
    }
    return undefined;
  }

  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const id = this.nextEnrollmentId++;
    const now = new Date();
    const enrollment: Enrollment = {
      ...enrollmentData,
      id,
      enrolledAt: now,
      progress: 0,
      completed: false
    };

    this.enrollmentStore.set(id, enrollment);
    return enrollment;
  }

  // Progress
  async getUserRecentProgress(userId: number): Promise<any[]> {
    // Get all progress entries for the user, sorted by last watched time
    const progress = Array.from(this.progressStore.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => {
        if (!a.lastWatched || !b.lastWatched) return 0;
        return new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime();
      })
      .slice(0, 5); // Get only the 5 most recent entries
    
    // Enrich with lesson and course data
    return progress.map(p => {
      const lesson = this.lessonStore.get(p.lessonId);
      const course = lesson ? this.courseStore.get(lesson.courseId) : undefined;
      
      return {
        ...p,
        lesson,
        course
      };
    });
  }

  // Orders
  async getUserOrders(userId: number): Promise<Order[]> {
    const orders = Array.from(this.orderStore.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Attach course data to each order
    return orders.map(order => {
      const course = this.courseStore.get(order.courseId);
      return {
        ...order,
        course
      };
    });
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.nextOrderId++;
    const now = new Date();
    const order: Order = {
      ...orderData,
      id,
      createdAt: now
    };

    this.orderStore.set(id, order);
    return order;
  }

  async getRecentOrders(): Promise<Order[]> {
    const orders = Array.from(this.orderStore.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10); // Get only the 10 most recent orders
    
    // Enrich with user and course data
    return orders.map(order => {
      const user = this.userStore.get(order.userId);
      const course = this.courseStore.get(order.courseId);
      
      return {
        ...order,
        user,
        course
      };
    });
  }

  // Admin stats
  async getAdminStats(): Promise<{
    usersCount: number;
    coursesCount: number;
    ordersCount: number;
    revenue: number;
    usersChange: number;
    coursesChange: number;
    ordersChange: number;
    revenueChange: number;
  }> {
    const usersCount = this.userStore.size;
    const coursesCount = this.courseStore.size;
    const ordersCount = this.orderStore.size;
    
    // Calculate total revenue
    const revenue = Array.from(this.orderStore.values())
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.amount, 0);
    
    // Calculate month-over-month changes (using mock data for demo)
    return {
      usersCount,
      coursesCount,
      ordersCount,
      revenue,
      usersChange: 12,
      coursesChange: 8,
      ordersChange: 15,
      revenueChange: 18
    };
  }

  async getRevenueByMonth(year: number): Promise<{ name: string; value: number }[]> {
    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    
    // Initialize result with zero revenue for each month
    const result = monthNames.map(name => ({ name, value: 0 }));
    
    // Filter orders by year and aggregate by month
    const completedOrders = Array.from(this.orderStore.values())
      .filter(order => order.status === 'completed');
    
    for (const order of completedOrders) {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getFullYear() === year) {
        const month = orderDate.getMonth();
        result[month].value += order.amount;
      }
    }
    
    return result;
  }

  // Testimonials
  async getTestimonials(): Promise<any[]> {
    // Return a few handpicked reviews as testimonials
    const testimonials = [
      {
        content: "Khóa học React & TypeScript đã giúp tôi tiến bộ rất nhiều trong công việc. Giảng viên giải thích rõ ràng và có nhiều bài tập thực hành giúp tôi nắm vững kiến thức.",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        name: "Nguyễn Minh Anh",
        role: "Front-end Developer",
        rating: 5
      },
      {
        content: "Digital Marketing từ A-Z là khóa học tuyệt vời. Tôi đã áp dụng các kỹ thuật SEO và đã thấy kết quả rõ rệt trong vòng 3 tháng. Rất đáng đồng tiền bát gạo!",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        name: "Trần Văn Bình",
        role: "Marketing Manager",
        rating: 5
      },
      {
        content: "Khóa học Python cho Data Science giúp tôi chuyển đổi nghề nghiệp thành công. Từ một người không biết gì về lập trình, giờ tôi đã làm việc trong lĩnh vực phân tích dữ liệu.",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        name: "Lê Thị Hương",
        role: "Data Analyst",
        rating: 4.5
      }
    ];
    
    return testimonials;
  }

  // Helper method to seed initial data
  private seedData() {
    // Create admin user
    const adminUser: User = {
      id: this.nextUserId++,
      username: "admin",
      password: "password",
      email: "admin@eduvn.com",
      fullName: "Admin User",
      role: "admin",
      isActive: true,
      createdAt: new Date()
    };
    this.userStore.set(adminUser.id, adminUser);

    // Create a student user
    const studentUser: User = {
      id: this.nextUserId++,
      username: "student",
      password: "password",
      email: "student@example.com",
      fullName: "Student User",
      role: "student",
      isActive: true,
      createdAt: new Date()
    };
    this.userStore.set(studentUser.id, studentUser);

    // Create an instructor user
    const instructorUser: User = {
      id: this.nextUserId++,
      username: "instructor",
      password: "password",
      email: "instructor@example.com",
      fullName: "Instructor User",
      role: "instructor",
      isActive: true,
      createdAt: new Date()
    };
    this.userStore.set(instructorUser.id, instructorUser);

    // Create categories
    const categories: Partial<Category>[] = [
      { name: "Lập trình web", slug: "lap-trinh-web", icon: "web", description: "HTML, CSS, JavaScript, React, Angular, Node.js và nhiều kỹ năng hơn để phát triển web chuyên nghiệp." },
      { name: "Phát triển di động", slug: "phat-trien-di-dong", icon: "mobile", description: "Android, iOS, React Native, Flutter và các công nghệ hiện đại khác để xây dựng ứng dụng di động." },
      { name: "Ngoại ngữ", slug: "ngoai-ngu", icon: "language", description: "Tiếng Anh, Tiếng Nhật, Tiếng Hàn và nhiều ngôn ngữ khác." },
      { name: "Marketing", slug: "marketing", icon: "marketing", description: "SEO, Google Ads, Facebook Ads, Email Marketing và chiến lược tiếp thị số toàn diện." },
      { name: "Thiết kế", slug: "thiet-ke", icon: "design", description: "UI/UX Design, Đồ họa, Photoshop, Illustrator và các công cụ thiết kế chuyên nghiệp." }
    ];

    categories.forEach(category => {
      const id = this.nextCategoryId++;
      this.categoryStore.set(id, { ...category, id } as Category);
    });

    // Create courses
    const courses: Partial<Course>[] = [
      {
        title: "React & TypeScript - Xây dựng ứng dụng Web hiện đại",
        slug: "react-typescript-web-modern",
        description: "Học cách xây dựng ứng dụng React hiện đại với TypeScript, Redux và các thư viện phổ biến khác. Khóa học toàn diện giúp bạn nắm vững kiến thức frontend hiện đại.",
        price: 799000,
        originalPrice: 1299000,
        thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051",
        level: "intermediate",
        categoryId: 1, // Lập trình web
        instructorId: 3, // instructor user
        isPublished: true,
        isApproved: true,
        isFeatured: true,
        isPopular: false,
        totalStudents: 2342,
        totalHours: 32,
        averageRating: 4.8,
        totalRatings: 567
      },
      {
        title: "Python cho Data Science và Machine Learning",
        slug: "python-data-science-machine-learning",
        description: "Khám phá thế giới khoa học dữ liệu và học máy với Python. Từ cơ bản đến nâng cao, bạn sẽ học cách xử lý, phân tích dữ liệu và xây dựng mô hình ML.",
        price: 899000,
        originalPrice: 1599000,
        thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
        level: "beginner",
        categoryId: 1, // Lập trình web
        instructorId: 3, // instructor user
        isPublished: true,
        isApproved: true,
        isFeatured: true,
        isPopular: true,
        totalStudents: 1845,
        totalHours: 28,
        averageRating: 4.9,
        totalRatings: 432
      },
      {
        title: "Digital Marketing từ A-Z: Từ cơ bản đến nâng cao",
        slug: "digital-marketing-a-z",
        description: "Học cách xây dựng chiến lược digital marketing toàn diện. Khóa học bao gồm SEO, SEM, Social Media, Email Marketing và nhiều kỹ thuật khác.",
        price: 699000,
        originalPrice: 1199000,
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        level: "all-levels",
        categoryId: 4, // Marketing
        instructorId: 3, // instructor user
        isPublished: true,
        isApproved: true,
        isFeatured: true,
        isPopular: false,
        totalStudents: 3142,
        totalHours: 24,
        averageRating: 4.7,
        totalRatings: 789
      },
      {
        title: "Docker và Kubernetes: Từ cơ bản đến triển khai",
        slug: "docker-kubernetes-basics",
        description: "Tìm hiểu về containerization với Docker và orchestration với Kubernetes. Thực hành triển khai ứng dụng thực tế lên môi trường cloud.",
        price: 599000,
        originalPrice: null,
        thumbnail: "https://images.unsplash.com/photo-1661956602926-db6b25f75947",
        level: "intermediate",
        categoryId: 1, // Lập trình web
        instructorId: 3, // instructor user
        isPublished: true,
        isApproved: true,
        isFeatured: false,
        isPopular: false,
        totalStudents: 342,
        totalHours: 18,
        averageRating: 4.6,
        totalRatings: 98
      },
      {
        title: "GraphQL API: Thiết kế và triển khai hiệu quả",
        slug: "graphql-api-design-deployment",
        description: "Học cách thiết kế, xây dựng và triển khai GraphQL API hiệu quả. So sánh với REST và tối ưu hiệu suất API.",
        price: 499000,
        originalPrice: null,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        level: "advanced",
        categoryId: 1, // Lập trình web
        instructorId: 3, // instructor user
        isPublished: true,
        isApproved: true,
        isFeatured: false,
        isPopular: false,
        totalStudents: 128,
        totalHours: 12,
        averageRating: 4.9,
        totalRatings: 45
      },
      {
        title: "Next.js 13: Xây dựng ứng dụng full-stack hiện đại",
        slug: "nextjs-13-fullstack",
        description: "Làm chủ Next.js 13 với các tính năng mới nhất. Xây dựng ứng dụng full-stack với server components, API routes và triển khai lên Vercel.",
        price: 649000,
        originalPrice: null,
        thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
        level: "intermediate",
        categoryId: 1, // Lập trình web
        instructorId: 3, // instructor user
        isPublished: true,
        isApproved: true,
        isFeatured: false,
        isPopular: false,
        totalStudents: 87,
        totalHours: 15,
        averageRating: 5.0,
        totalRatings: 23
      },
      {
        title: "Figma: Thiết kế UI/UX chuyên nghiệp từ A-Z",
        slug: "figma-ui-ux-design",
        description: "Học cách sử dụng Figma để thiết kế giao diện người dùng hiện đại. Từ wireframing đến prototype và design system.",
        price: 499000,
        originalPrice: null,
        thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d",
        level: "beginner",
        categoryId: 5, // Thiết kế
        instructorId: 3, // instructor user
        isPublished: true,
        isApproved: true,
        isFeatured: false,
        isPopular: false,
        totalStudents: 156,
        totalHours: 16,
        averageRating: 4.8,
        totalRatings: 67
      }
    ];

    courses.forEach(course => {
      const id = this.nextCourseId++;
      const now = new Date();
      this.courseStore.set(id, { 
        ...course, 
        id,
        createdAt: now,
        updatedAt: now
      } as Course);
    });

    // Create sections for the first course
    const sections: Partial<Section>[] = [
      {
        title: "Giới thiệu khóa học",
        description: "Tổng quan về khóa học và cài đặt môi trường",
        courseId: 1,
        order: 1
      },
      {
        title: "Cơ bản về TypeScript",
        description: "Học các kiến thức cơ bản về TypeScript",
        courseId: 1,
        order: 2
      },
      {
        title: "Cơ bản về React",
        description: "Học các kiến thức cơ bản về React",
        courseId: 1,
        order: 3
      },
      {
        title: "Tích hợp TypeScript vào React",
        description: "Kết hợp React và TypeScript",
        courseId: 1,
        order: 4
      },
      {
        title: "Quản lý state với Redux Toolkit",
        description: "Sử dụng Redux Toolkit để quản lý state",
        courseId: 1,
        order: 5
      }
    ];

    sections.forEach(section => {
      const id = this.nextSectionId++;
      this.sectionStore.set(id, { ...section, id } as Section);

      // Create some lessons for each section
      if (id === 1) {
        const lessons: Partial<Lesson>[] = [
          {
            title: "Giới thiệu về khóa học",
            description: "Tổng quan về những gì bạn sẽ học",
            videoUrl: "https://example.com/video1.mp4",
            duration: 320, // in seconds
            isFree: true,
            sectionId: id,
            courseId: 1,
            order: 1
          },
          {
            title: "Cài đặt môi trường phát triển",
            description: "Cài đặt Node.js, npm và VS Code",
            videoUrl: "https://example.com/video2.mp4",
            duration: 525,
            isFree: false,
            sectionId: id,
            courseId: 1,
            order: 2
          },
          {
            title: "Tài liệu khóa học",
            description: "Tải xuống tài liệu tham khảo cho khóa học",
            videoUrl: null,
            duration: 0,
            isFree: false,
            sectionId: id,
            courseId: 1,
            order: 3
          },
          {
            title: "Source code GitHub",
            description: "Liên kết đến source code trên GitHub",
            videoUrl: null,
            duration: 0,
            isFree: false,
            sectionId: id,
            courseId: 1,
            order: 4
          }
        ];

        lessons.forEach(lesson => {
          const lessonId = this.nextLessonId++;
          this.lessonStore.set(lessonId, { ...lesson, id: lessonId } as Lesson);
        });
      }
    });

    // Create a few initial reviews
    const reviews: Partial<Review>[] = [
      {
        userId: 2,
        courseId: 1,
        rating: 5,
        content: "Khóa học tuyệt vời! Giảng viên giải thích rất rõ ràng và dễ hiểu. Tôi đã học được rất nhiều từ các dự án thực tế trong khóa học.",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      },
      {
        userId: 2,
        courseId: 2,
        rating: 4.5,
        content: "Tôi rất hài lòng với khóa học này. Nội dung cập nhật với phiên bản mới nhất. Phần Redux Toolkit giúp tôi hiểu rõ hơn về quản lý state.",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
      }
    ];

    reviews.forEach(review => {
      const id = this.nextReviewId++;
      this.reviewStore.set(id, { ...review, id } as Review);
    });

    // Create a few enrollments
    const enrollments: Partial<Enrollment>[] = [
      {
        userId: 2,
        courseId: 1,
        enrolledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        progress: 75,
        completed: false,
        price: 799000
      },
      {
        userId: 2,
        courseId: 2,
        enrolledAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        progress: 100,
        completed: true,
        price: 899000
      }
    ];

    enrollments.forEach(enrollment => {
      const id = this.nextEnrollmentId++;
      this.enrollmentStore.set(id, { ...enrollment, id } as Enrollment);
    });

    // Create orders for the enrollments
    enrollments.forEach(enrollment => {
      const id = this.nextOrderId++;
      const order: Order = {
        id,
        userId: enrollment.userId!,
        courseId: enrollment.courseId!,
        amount: enrollment.price!,
        status: "completed",
        createdAt: enrollment.enrolledAt!
      };
      this.orderStore.set(id, order);
    });

    // Create some progress records
    const progress: Partial<UserLessonProgress>[] = [
      {
        userId: 2,
        lessonId: 1,
        courseId: 1,
        completed: true,
        lastWatched: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        watchedSeconds: 320
      },
      {
        userId: 2,
        lessonId: 2,
        courseId: 1,
        completed: true,
        lastWatched: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        watchedSeconds: 525
      },
      {
        userId: 2,
        lessonId: 3,
        courseId: 1,
        completed: true,
        lastWatched: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        watchedSeconds: 0
      },
      {
        userId: 2,
        lessonId: 4,
        courseId: 1,
        completed: false,
        lastWatched: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        watchedSeconds: 0
      }
    ];

    progress.forEach(p => {
      const id = this.nextProgressId++;
      this.progressStore.set(id, { ...p, id } as UserLessonProgress);
    });
  }
}

export class DatabaseStorage implements IStorage {
  // Initialize with memory store by default, will be replaced with PostgreSQL store in constructor
  sessionStore: session.Store = new (memorystore(session))({
    checkPeriod: 86400000 // prune expired entries every 24h
  });

  constructor() {
    // Use connect-pg-simple for PostgreSQL session store
    // We're using dynamic import to handle ES modules compatibility
    this.initSessionStore();
  }
  
  // Method to initialize the session store
  private async initSessionStore(): Promise<void> {
    try {
      const pgSimpleModule = await import('connect-pg-simple');
      const PostgresSessionStore = pgSimpleModule.default(session);
      this.sessionStore = new PostgresSessionStore({
        conObject: {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        },
        createTableIfMissing: true
      });
      console.log("PostgreSQL session store initialized");
    } catch (error) {
      console.error('Failed to initialize PostgreSQL session store:', error);
      // Keep using the memory store that was initialized as the default
      console.log("Using in-memory session store instead");
    }
  }
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ isActive })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getUsers(options: { 
    page: number;
    limit: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number }> {
    const { page, limit, search, role, isActive } = options;
    const offset = (page - 1) * limit;
    
    let query = db.select().from(users);
    let countQuery = db.select({ count: count() }).from(users);
    
    // Apply filters
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(users.username, `%${search}%`),
          like(users.fullName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }
    
    if (role) {
      conditions.push(eq(users.role, role));
    }
    
    if (typeof isActive === 'boolean') {
      conditions.push(eq(users.isActive, isActive));
    }
    
    if (conditions.length > 0) {
      const whereClause = conditions.reduce((acc, condition) => and(acc, condition));
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    // Get total count
    const [{ count: total }] = await countQuery;
    
    // Get users with pagination
    const userList = await query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
    
    return {
      users: userList,
      total: Number(total),
    };
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  // Courses
  async getAllCourses(): Promise<Course[]> {
    return db.select()
      .from(courses)
      .where(and(
        eq(courses.isPublished, true),
        eq(courses.isApproved, true)
      ));
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return db.select()
      .from(courses)
      .where(and(
        eq(courses.isPublished, true),
        eq(courses.isApproved, true),
        eq(courses.isFeatured, true)
      ))
      .limit(6);
  }

  async getLatestCourses(): Promise<Course[]> {
    return db.select()
      .from(courses)
      .where(and(
        eq(courses.isPublished, true),
        eq(courses.isApproved, true)
      ))
      .orderBy(desc(courses.createdAt))
      .limit(6);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    return course || undefined;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async updateCourse(id: number, courseData: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  async incrementCourseStudents(courseId: number): Promise<void> {
    await db
      .update(courses)
      .set({
        totalStudents: sql`${courses.totalStudents} + 1`,
      })
      .where(eq(courses.id, courseId));
  }

  async getAdminCourses(options: {
    page: number;
    limit: number;
    search?: string;
    isApproved?: boolean;
    isPublished?: boolean;
  }): Promise<{ courses: Course[]; total: number }> {
    const { page, limit, search, isApproved, isPublished } = options;
    const offset = (page - 1) * limit;
    
    let query = db.select().from(courses);
    let countQuery = db.select({ count: count() }).from(courses);
    
    // Apply filters
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(courses.title, `%${search}%`),
          like(courses.description, `%${search}%`)
        )
      );
    }
    
    if (typeof isApproved === 'boolean') {
      conditions.push(eq(courses.isApproved, isApproved));
    }
    
    if (typeof isPublished === 'boolean') {
      conditions.push(eq(courses.isPublished, isPublished));
    }
    
    if (conditions.length > 0) {
      const whereClause = conditions.reduce((acc, condition) => and(acc, condition));
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    // Get total count
    const [{ count: total }] = await countQuery;
    
    // Get courses with pagination
    const coursesList = await query
      .orderBy(desc(courses.createdAt))
      .limit(limit)
      .offset(offset);
    
    return {
      courses: coursesList,
      total: Number(total),
    };
  }

  // Sections and Lessons
  async getCourseSections(courseId: number): Promise<Section[]> {
    const sectionsData = await db
      .select()
      .from(sections)
      .where(eq(sections.courseId, courseId))
      .orderBy(asc(sections.order));
    
    // Get all lessons for this course in one query
    const lessonsData = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.order));
    
    // Group lessons by sectionId
    const lessonsBySection: Record<number, Lesson[]> = {};
    for (const lesson of lessonsData) {
      if (!lessonsBySection[lesson.sectionId]) {
        lessonsBySection[lesson.sectionId] = [];
      }
      lessonsBySection[lesson.sectionId].push(lesson);
    }
    
    // Attach lessons to each section
    return sectionsData.map(section => {
      return {
        ...section,
        lessons: lessonsBySection[section.id] || [],
      };
    });
  }

  // Reviews
  async getCourseReviews(courseId: number): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.courseId, courseId))
      .orderBy(desc(reviews.createdAt));
  }

  async getUserCourseReview(userId: number, courseId: number): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(and(
        eq(reviews.userId, userId),
        eq(reviews.courseId, courseId)
      ));
    return review || undefined;
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    
    // Update course rating
    await this.updateCourseRating(reviewData.courseId);
    
    return review;
  }

  private async updateCourseRating(courseId: number): Promise<void> {
    const [result] = await db
      .select({
        avgRating: sql`avg(${reviews.rating})`.as("avgRating"),
        count: count().as("count"),
      })
      .from(reviews)
      .where(eq(reviews.courseId, courseId));
    
    const avgRating = result?.avgRating || 0;
    const totalRatings = Number(result?.count) || 0;
    
    await db
      .update(courses)
      .set({ 
        averageRating: avgRating, 
        totalRatings: totalRatings,
      })
      .where(eq(courses.id, courseId));
  }

  // Enrollments
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getUserCourseEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ));
    return enrollment || undefined;
  }

  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
    
    // Increment course students count
    await this.incrementCourseStudents(enrollmentData.courseId);
    
    return enrollment;
  }

  // Progress
  async getUserRecentProgress(userId: number): Promise<any[]> {
    const userProgressTable = alias(userLessonProgress, 'progress');
    const courseAlias = alias(courses, 'course');
    const lessonAlias = alias(lessons, 'lesson');
    
    return db
      .select({
        progress: userProgressTable,
        course: {
          id: courseAlias.id,
          title: courseAlias.title,
          slug: courseAlias.slug,
          thumbnail: courseAlias.thumbnail,
        },
        lesson: {
          id: lessonAlias.id,
          title: lessonAlias.title,
        },
      })
      .from(userProgressTable)
      .innerJoin(courseAlias, eq(userProgressTable.courseId, courseAlias.id))
      .innerJoin(lessonAlias, eq(userProgressTable.lessonId, lessonAlias.id))
      .where(eq(userProgressTable.userId, userId))
      .orderBy(desc(userProgressTable.lastWatched))
      .limit(5);
  }

  // Orders
  async getUserOrders(userId: number): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async getRecentOrders(): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);
  }

  // Admin Stats
  async getAdminStats(): Promise<{
    usersCount: number;
    coursesCount: number;
    ordersCount: number;
    revenue: number;
    usersChange: number;
    coursesChange: number;
    ordersChange: number;
    revenueChange: number;
  }> {
    // Current date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Get counts for current month
    const [currentUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startOfMonth));
    
    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);
    
    const [currentCourses] = await db
      .select({ count: count() })
      .from(courses)
      .where(gte(courses.createdAt, startOfMonth));
    
    const [totalCourses] = await db
      .select({ count: count() })
      .from(courses);
    
    const [currentOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(gte(orders.createdAt, startOfMonth));
    
    const [totalOrders] = await db
      .select({ count: count() })
      .from(orders);
    
    const [currentRevenue] = await db
      .select({ sum: sum(orders.amount) })
      .from(orders)
      .where(gte(orders.createdAt, startOfMonth));
    
    const [totalRevenue] = await db
      .select({ sum: sum(orders.amount) })
      .from(orders);
    
    // Get counts for previous month
    const [prevUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        gte(users.createdAt, startOfPrevMonth),
        lte(users.createdAt, endOfPrevMonth)
      ));
    
    const [prevCourses] = await db
      .select({ count: count() })
      .from(courses)
      .where(and(
        gte(courses.createdAt, startOfPrevMonth),
        lte(courses.createdAt, endOfPrevMonth)
      ));
    
    const [prevOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(and(
        gte(orders.createdAt, startOfPrevMonth),
        lte(orders.createdAt, endOfPrevMonth)
      ));
    
    const [prevRevenue] = await db
      .select({ sum: sum(orders.amount) })
      .from(orders)
      .where(and(
        gte(orders.createdAt, startOfPrevMonth),
        lte(orders.createdAt, endOfPrevMonth)
      ));
    
    // Calculate percentage changes
    const usersChange = prevUsers.count === 0 ? 100 : 
      Math.round(((Number(currentUsers.count) - Number(prevUsers.count)) / Number(prevUsers.count)) * 100);
    
    const coursesChange = prevCourses.count === 0 ? 100 : 
      Math.round(((Number(currentCourses.count) - Number(prevCourses.count)) / Number(prevCourses.count)) * 100);
    
    const ordersChange = prevOrders.count === 0 ? 100 : 
      Math.round(((Number(currentOrders.count) - Number(prevOrders.count)) / Number(prevOrders.count)) * 100);
    
    const revenueChange = (prevRevenue.sum || 0) === 0 ? 100 : 
      Math.round(((Number(currentRevenue.sum || 0) - Number(prevRevenue.sum || 0)) / Number(prevRevenue.sum || 0)) * 100);
    
    return {
      usersCount: Number(totalUsers.count),
      coursesCount: Number(totalCourses.count),
      ordersCount: Number(totalOrders.count),
      revenue: Number(totalRevenue.sum || 0),
      usersChange,
      coursesChange,
      ordersChange,
      revenueChange,
    };
  }

  async getRevenueByMonth(year: number): Promise<{ name: string; value: number }[]> {
    const results = [];
    
    // Get all orders for the specified year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    
    const allOrders = await db
      .select()
      .from(orders)
      .where(and(
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate)
      ));
    
    // Initialize revenue for all months
    const monthNames = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const monthlyRevenue: Record<string, number> = {};
    
    for (const monthName of monthNames) {
      monthlyRevenue[monthName] = 0;
    }
    
    // Sum revenues by month
    for (const order of allOrders) {
      const month = order.createdAt.getMonth();
      const monthName = monthNames[month];
      monthlyRevenue[monthName] += order.amount;
    }
    
    // Create result array
    for (const monthName of monthNames) {
      results.push({
        name: monthName,
        value: monthlyRevenue[monthName],
      });
    }
    
    return results;
  }

  // Testimonials
  async getTestimonials(): Promise<any[]> {
    const recentReviews = await db
      .select({
        review: reviews,
        user: {
          id: users.id,
          fullName: users.fullName,
          avatar: users.avatar,
          role: users.role,
        },
        course: {
          id: courses.id,
          title: courses.title,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(courses, eq(reviews.courseId, courses.id))
      .where(isNotNull(reviews.content))
      .orderBy(desc(reviews.createdAt))
      .limit(6);
    
    return recentReviews.map(item => ({
      id: item.review.id,
      content: item.review.content,
      rating: item.review.rating,
      name: item.user.fullName,
      avatarUrl: item.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.fullName)}`,
      role: item.user.role === 'instructor' ? 'Instructor' : 'Student',
      courseTitle: item.course.title,
    }));
  }
}

// Switch from memory storage to database storage
export const storage = new DatabaseStorage();

-- Nexora PostgreSQL Schema
-- Directly compatible with Supabase SQL Editor

-- Create Roles Enum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN');

-- Create Difficulty Enum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- Create RequestStatus Enum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- Create OrderStatus Enum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');

-- Create TicketStatus Enum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- Create LogType Enum
CREATE TYPE "LogType" AS ENUM ('USER_EVENT', 'SECURITY_EVENT', 'TRANSACT_EVENT');

-- Create Users Table
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "avatar" VARCHAR(500),
    "college" VARCHAR(255),
    "department" VARCHAR(255),
    "year" VARCHAR(50),
    "phone" VARCHAR(50),
    "isVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create MentorProfile Table
CREATE TABLE "MentorProfile" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "specialty" VARCHAR(100)[] NOT NULL,
    "experience" VARCHAR(50) NOT NULL,
    "bio" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "isApproved" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create AdminProfile Table
CREATE TABLE "AdminProfile" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "permissions" VARCHAR(100)[] NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE "Category" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "icon" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Tags Table
CREATE TABLE "Tag" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL
);

-- Create Projects Table
CREATE TABLE "Project" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "features" TEXT[] NOT NULL,
    "technologies" TEXT[] NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "duration" VARCHAR(100) NOT NULL,
    "image" VARCHAR(500) NOT NULL,
    "screenshots" VARCHAR(500)[] NOT NULL,
    "demoVideo" VARCHAR(500),
    "docUrl" VARCHAR(500),
    "codeUrl" VARCHAR(500),
    "githubUrl" VARCHAR(500),
    "installationGuide" TEXT,
    "version" VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    "license" VARCHAR(100) NOT NULL DEFAULT 'MIT',
    "isPremium" BOOLEAN NOT NULL DEFAULT FALSE,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "discountPrice" DOUBLE PRECISION,
    "categoryId" UUID NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table (Marketplace)
CREATE TABLE "Product" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discountPrice" DOUBLE PRECISION,
    "image" VARCHAR(500) NOT NULL,
    "fileUrl" VARCHAR(500) NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "version" VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    "license" VARCHAR(100) NOT NULL DEFAULT 'Personal Use',
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "categoryId" UUID NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Downloads Table
CREATE TABLE "Download" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "downloadedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Favorites Table
CREATE TABLE "Favorite" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_projectId_key" UNIQUE ("userId", "projectId")
);

-- Create Orders Table
CREATE TABLE "Order" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "payableAmount" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "couponCode" VARCHAR(100),
    "paymentId" VARCHAR(255) UNIQUE,
    "invoiceId" VARCHAR(255) UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create OrderItems Table
CREATE TABLE "OrderItem" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "projectId" UUID REFERENCES "Project"("id") ON DELETE SET NULL,
    "productId" UUID REFERENCES "Product"("id") ON DELETE SET NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1
);

-- Create Payments Table
CREATE TABLE "Payment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID UNIQUE NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "method" VARCHAR(100) NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "transactionId" VARCHAR(255) UNIQUE NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Invoices Table
CREATE TABLE "Invoice" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID UNIQUE NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "invoiceNumber" VARCHAR(255) UNIQUE NOT NULL,
    "gstNumber" VARCHAR(100),
    "billingAddress" TEXT NOT NULL,
    "pdfUrl" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Coupons Table
CREATE TABLE "Coupon" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "code" VARCHAR(100) UNIQUE NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "maxDiscountAmount" DOUBLE PRECISION NOT NULL,
    "minOrderAmount" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "usageLimit" INTEGER NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Subscriptions Table
CREATE TABLE "Subscription" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "planName" VARCHAR(255) NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "nextBillingDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Requests Table
CREATE TABLE "Request" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "college" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255) NOT NULL,
    "year" VARCHAR(50) NOT NULL,
    "projectTitle" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT[] NOT NULL,
    "deadline" TIMESTAMP WITH TIME ZONE NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "docUrl" VARCHAR(500),
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RequestMilestones Table
CREATE TABLE "RequestMilestone" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "requestId" UUID NOT NULL REFERENCES "Request"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "percent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Reviews Table
CREATE TABLE "Review" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_userId_projectId_key" UNIQUE ("userId", "projectId")
);

-- Create Comments Table
CREATE TABLE "Comment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "projectId" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "parentId" UUID REFERENCES "Comment"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create SupportTickets Table
CREATE TABLE "SupportTicket" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "subject" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "priority" VARCHAR(50) NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create TicketMessages Table
CREATE TABLE "TicketMessage" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "ticketId" UUID NOT NULL REFERENCES "SupportTicket"("id") ON DELETE CASCADE,
    "senderId" VARCHAR(255) NOT NULL,
    "senderName" VARCHAR(255) NOT NULL,
    "text" TEXT NOT NULL,
    "isFromStaff" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Notifications Table
CREATE TABLE "Notification" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Testimonials Table
CREATE TABLE "Testimonial" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentName" VARCHAR(255) NOT NULL,
    "college" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatar" VARCHAR(500),
    "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Blogs Table
CREATE TABLE "Blog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "content" TEXT NOT NULL,
    "image" VARCHAR(500) NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Tutorials Table
CREATE TABLE "Tutorial" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "content" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "readTime" VARCHAR(50) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Roadmaps Table
CREATE TABLE "Roadmap" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "steps" TEXT[] NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Certificates Table
CREATE TABLE "Certificate" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "type" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "certificateNumber" VARCHAR(255) UNIQUE NOT NULL,
    "fileUrl" VARCHAR(500) NOT NULL,
    "issuedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ActivityLogs Table
CREATE TABLE "ActivityLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "activity" VARCHAR(255) NOT NULL,
    "logType" "LogType" NOT NULL DEFAULT 'USER_EVENT',
    "ipAddress" VARCHAR(50),
    "userAgent" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create AuditLogs Table
CREATE TABLE "AuditLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "adminId" UUID NOT NULL REFERENCES "AdminProfile"("id") ON DELETE CASCADE,
    "action" VARCHAR(255) NOT NULL,
    "targetTable" VARCHAR(100) NOT NULL,
    "targetId" VARCHAR(100) NOT NULL,
    "details" TEXT NOT NULL,
    "ipAddress" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Implicit many-to-many Join Tables for Tags
CREATE TABLE "_ProjectToTag" (
    "A" UUID NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "B" UUID NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE,
    CONSTRAINT "_ProjectToTag_AB_unique" UNIQUE ("A", "B")
);
CREATE INDEX "_ProjectToTag_B_index" ON "_ProjectToTag"("B");

CREATE TABLE "_ProductToTag" (
    "A" UUID NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "B" UUID NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE,
    CONSTRAINT "_ProductToTag_AB_unique" UNIQUE ("A", "B")
);
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

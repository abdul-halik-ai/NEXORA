import { z } from 'zod'

// 1. Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid student or admin email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN']).default('STUDENT'),
})

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid student email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone: z.string().optional(),
  college: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  role: z.enum(['STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN']).default('STUDENT'),
})

// 2. Custom Project Request Schema
export const customRequestSchema = z.object({
  studentName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Contact phone is required'),
  college: z.string().min(2, 'College name is required'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().default('3rd Year'),
  projectTitle: z.string().min(5, 'Project title must be at least 5 characters long'),
  description: z.string().min(20, 'Please write at least 20 characters describing requirements'),
  technologies: z.array(z.string()).min(1, 'Please specify at least 1 technology tag'),
  deadline: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Deadline date must be in the future',
  }),
  budget: z.coerce.number().min(100, 'Minimum budget allocation is 100 INR'),
})

// 3. Project Upload Schema
export const projectUploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Short summary must be at least 10 characters long'),
  longDescription: z.string().min(30, 'Detailed overview must be at least 30 characters long'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  duration: z.string().min(2, 'Duration timeframe is required (e.g. 4 Weeks)'),
  categoryId: z.string().uuid('Please select a valid Domain Stream category'),
  image: z.string().url('Primary cover image URL must be a valid address'),
  technologies: z.array(z.string()).min(1, 'Please select at least 1 technology'),
  features: z.array(z.string()).min(1, 'Please specify at least 1 key feature'),
  demoVideo: z.string().url('Demo video link must be a valid URL').optional().or(z.literal('')),
  docUrl: z.string().optional().or(z.literal('')),
  codeUrl: z.string().optional().or(z.literal('')),
  isPremium: z.boolean().default(false),
  price: z.coerce.number().default(0.0),
  discountPrice: z.coerce.number().optional(),
})

// 4. Support Ticket Schema
export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long'),
  category: z.string().min(2, 'Please select support category'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  message: z.string().min(10, 'Please elaborate your issue in at least 10 characters'),
})

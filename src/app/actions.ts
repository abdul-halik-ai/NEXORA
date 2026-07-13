'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as services from '@/lib/services'
import { getCurrentUser } from '@/lib/auth'

// Newsletter Subscription
export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return { error: 'Email is required' }
  
  await services.createNotification('default-student-id', 'Newsletter Subscription', `Thank you for subscribing with ${email}!`)
  return { success: true }
}

// Submit Custom Project Request
export async function submitProjectRequest(prevState: any, formData: FormData) {
  try {
    const studentName = formData.get('studentName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const college = formData.get('college') as string
    const department = formData.get('department') as string
    const year = formData.get('year') as string
    const projectTitle = formData.get('projectTitle') as string
    const description = formData.get('description') as string
    const technologiesInput = formData.get('technologies') as string
    const deadlineInput = formData.get('deadline') as string
    const budgetInput = formData.get('budget') as string

    if (!studentName || !email || !projectTitle || !description) {
      return { error: 'Please fill in all required fields' }
    }

    const technologies = technologiesInput 
      ? technologiesInput.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const deadline = deadlineInput ? new Date(deadlineInput) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    const budget = budgetInput ? parseFloat(budgetInput) : 5000.0

    // Add docUrl placeholder (simulating upload)
    const docUrl = '#'

    await services.createRequest({
      studentName,
      email,
      phone,
      college,
      department,
      year,
      projectTitle,
      description,
      technologies,
      deadline,
      budget,
      docUrl,
    })

    // Notify Admins and User
    const user = await getCurrentUser()
    if (user) {
      await services.createNotification(user.id, 'Project Request Submitted', `Your custom request for "${projectTitle}" is under review.`)
    }

    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to submit request' }
  }
}

// Add/Update Project (Admin)
export async function saveProject(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const longDescription = formData.get('longDescription') as string
    const difficulty = formData.get('difficulty') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    const duration = formData.get('duration') as string
    const categoryId = formData.get('categoryId') as string
    const image = formData.get('image') as string || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
    const technologies = (formData.get('technologies') as string)?.split(',').map(t => t.trim()).filter(Boolean) || []
    const features = (formData.get('features') as string)?.split('\n').map(f => f.trim()).filter(Boolean) || []
    const demoVideo = formData.get('demoVideo') as string || '#'
    const docUrl = formData.get('docUrl') as string || '#'
    const codeUrl = formData.get('codeUrl') as string || '#'

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const projectData = {
      title,
      slug,
      description,
      longDescription,
      difficulty,
      duration,
      categoryId,
      image,
      technologies,
      features,
      demoVideo,
      docUrl,
      codeUrl,
    }

    if (id) {
      await services.updateProject(id, projectData)
    } else {
      await services.createProject(projectData)
    }

    revalidatePath('/projects')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to save project' }
  }
}

// Delete Project (Admin)
export async function deleteProject(id: string) {
  try {
    await services.deleteProject(id)
    revalidatePath('/projects')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete project' }
  }
}

// Update Request Status (Admin)
export async function updateRequestStatus(id: string, status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED') {
  try {
    const updated = await services.updateRequestStatus(id, status)
    
    // Find request detail to notify student
    if (updated) {
      // Find user with matching email
      // We can broadcast/log a notification
      console.log(`Request ${id} status updated to ${status}`)
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update status' }
  }
}

// Submit Review
export async function submitReview(projectId: string, rating: number, comment: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return { error: 'You must be logged in to leave reviews.' }

    await services.createReview(user.id, projectId, rating, comment, user.name)
    revalidatePath(`/projects/[slug]`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to submit review' }
  }
}

// Submit Comment
export async function submitComment(projectId: string, text: string, parentId: string | null) {
  try {
    const user = await getCurrentUser()
    if (!user) return { error: 'You must be logged in to comment.' }

    await services.createComment(user.id, projectId, text, parentId, user.name)
    revalidatePath(`/projects/[slug]`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to post comment' }
  }
}

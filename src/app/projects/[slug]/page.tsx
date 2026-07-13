import React from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import * as services from '@/lib/services'
import ProjectDetailsClient from '@/components/project/ProjectDetailsClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params
  
  const project = await services.getProjectBySlug(slug)

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Not Found</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The academic project you are looking for might have been moved or deleted.</p>
        <Link 
          href="/projects" 
          className="mt-6 inline-flex items-center space-x-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Repository</span>
        </Link>
      </div>
    )
  }

  // Load reviews, comments, and related projects
  const reviews = await services.getReviewsForProject(project.id)
  const comments = await services.getCommentsForProject(project.id)
  
  // Load related projects (same category, different id)
  const allCategoryProjects = await services.getProjects({ 
    categorySlug: project.category?.slug 
  })
  const relatedProjects = allCategoryProjects
    .filter((p: any) => p.id !== project.id)
    .slice(0, 3)

  return (
    <ProjectDetailsClient 
      initialProject={project} 
      initialReviews={reviews} 
      initialComments={comments} 
      relatedProjects={relatedProjects}
    />
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, Award, Clock, Star, ArrowUpRight } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    description: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration: string
    image: string
    technologies: string[]
    downloadCount: number
    category?: { name: string }
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const difficultyColors = {
    BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40',
    INTERMEDIATE: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40',
    ADVANCED: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 h-full glow-card glass"
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/0 to-slate-950/0" />
        
        {/* Category Badge */}
        {project.category && (
          <span className="absolute top-3 left-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 px-2 py-1 text-[10px] font-bold text-white tracking-wide uppercase">
            {project.category.name}
          </span>
        )}

        {/* Difficulty Badge */}
        <span className={`absolute top-3 right-3 rounded-lg border px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm ${difficultyColors[project.difficulty]}`}>
          {project.difficulty}
        </span>
      </div>

      {/* Info Content */}
      <div className="flex flex-grow flex-col p-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 flex-grow line-clamp-2">
          {project.description}
        </p>

        {/* Tech Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200/30 dark:border-slate-800"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Divider */}
        <hr className="my-4 border-slate-200/50 dark:border-slate-800" />

        {/* Card Footer Details */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-blue-500/70" />
            <span>{project.duration}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Download className="h-3.5 w-3.5 text-violet-500/70" />
            <span>{project.downloadCount} dl</span>
          </div>
          
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center space-x-0.5 text-blue-600 dark:text-blue-400 font-bold hover:underline group-hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

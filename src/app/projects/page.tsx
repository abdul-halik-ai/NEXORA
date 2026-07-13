'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, RefreshCcw, SlidersHorizontal, BookOpen, Layers } from 'lucide-react'
import ProjectCard from '@/components/shared/ProjectCard'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedSort, setSelectedSort] = useState('latest')

  // Fetch Categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories)
      })
      .catch(err => console.error(err))
  }, [])

  // Fetch Projects when filters change
  const fetchProjects = async () => {
    setLoading(true)
    try {
      let url = `/api/projects?sort=${selectedSort}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (selectedCategory) url += `&category=${selectedCategory}`
      if (selectedDifficulty) url += `&difficulty=${selectedDifficulty}`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [selectedCategory, selectedDifficulty, selectedSort])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProjects()
  }

  const handleResetFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSelectedDifficulty('')
    setSelectedSort('latest')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-grid-pattern">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-slate-200/50 dark:border-slate-800 space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Academic Project Repository</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Search and download fully working open source code packages for school and college submissions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Search Box */}
          <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-4 shadow-sm glass">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Search Query</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type keywords..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-3 pr-9 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2 text-slate-400 hover:text-blue-500"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Categories Selector */}
          <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-4 shadow-sm glass">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center">
              <Layers className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
              <span>Domain Stream</span>
            </h3>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                All Domains
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-4 shadow-sm glass">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center">
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
              <span>Complexity Level</span>
            </h3>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { name: 'All Levels', value: '' },
                { name: 'Beginner', value: 'BEGINNER' },
                { name: 'Intermediate', value: 'INTERMEDIATE' },
                { name: 'Advanced', value: 'ADVANCED' },
              ].map((diff) => (
                <button
                  key={diff.name}
                  onClick={() => setSelectedDifficulty(diff.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedDifficulty === diff.value 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {diff.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Filter */}
          <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-4 shadow-sm glass">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-pink-500" />
              <span>Sort Orders</span>
            </h3>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
            >
              <option value="latest">Latest uploads</option>
              <option value="popular">Popular reviews</option>
              <option value="downloaded">Most Downloaded</option>
            </select>
          </div>

        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
                  <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-md p-8">
              <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No projects found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Try resetting your filters or adjusting your search phrase to explore other projects.</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center space-x-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 shadow-md shadow-blue-500/10"
              >
                Show All Projects
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

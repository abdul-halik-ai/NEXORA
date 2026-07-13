'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Download, Clock, Eye, MessageSquare, Star, 
  FileText, Video, Play, ArrowLeft, ArrowUpRight,
  User, Send, CornerDownRight, ThumbsUp, Sparkles, Check
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { submitReview, submitComment } from '@/app/actions'
import { useToast } from '@/context/ToastContext'
import ProjectCard from '../shared/ProjectCard'

interface ProjectDetailsClientProps {
  initialProject: any
  initialReviews: any[]
  initialComments: any[]
  relatedProjects: any[]
}

export default function ProjectDetailsClient({ 
  initialProject, 
  initialReviews, 
  initialComments,
  relatedProjects
}: ProjectDetailsClientProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [project, setProject] = useState(initialProject)
  const [reviews, setReviews] = useState(initialReviews)
  const [comments, setComments] = useState(initialComments)
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'details' | 'code' | 'video' | 'reviews' | 'discussion'>('details')

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState('')

  // Comment Form State
  const [commentText, setCommentText] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  // Download Simulation State
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Handle Download Click
  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/download`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        if (data.project) {
          setProject((prev: any) => ({ ...prev, downloadCount: data.project.downloadCount }))
        }
        setDownloadSuccess(true)
        setTimeout(() => setDownloadSuccess(false), 5000)

        // Trigger file download mock
        const element = document.createElement("a");
        const file = new Blob(["// ProjectHub Download Key: PH-" + project.id + "\n// Source Code file for " + project.title + "\nconsole.log('Project Initialized successfully');"], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${project.slug}-source-code.zip`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  // Handle Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setReviewSubmitting(true)
    setReviewSuccess('')

    const res = await submitReview(project.id, reviewRating, reviewComment)
    if (res.success) {
      setReviews(prev => [
        {
          id: `rev-client-${Date.now()}`,
          userId: user.id,
          user: { name: user.name },
          rating: reviewRating,
          comment: reviewComment,
          createdAt: new Date(),
        },
        ...prev.filter(r => r.userId !== user.id), // Remove previous if existed
      ])
      setReviewComment('')
      setReviewSuccess('Review submitted successfully!')
    }
    setReviewSubmitting(false)
  }

  // Handle Comment Submission
  const handleCommentSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault()
    if (!user) return
    const textToSubmit = parentId ? replyText : commentText
    if (!textToSubmit.trim()) return

    setCommentSubmitting(true)

    const res = await submitComment(project.id, textToSubmit, parentId)
    if (res.success) {
      const newComment = {
        id: `comm-client-${Date.now()}`,
        text: textToSubmit,
        userId: user.id,
        user: { name: user.name },
        parentId: parentId,
        createdAt: new Date(),
      }
      setComments(prev => [...prev, newComment])
      
      if (parentId) {
        setReplyText('')
        setReplyTarget(null)
      } else {
        setCommentText('')
      }
    }
    setCommentSubmitting(false)
  }

  const difficultyColors = {
    BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40',
    INTERMEDIATE: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40',
    ADVANCED: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40',
  }

  // Group comments by hierarchy
  const rootComments = comments.filter(c => !c.parentId)
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <Link 
        href="/projects" 
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-500 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Repository</span>
      </Link>

      {/* Hero Banner Grid */}
      <div className="grid lg:grid-cols-3 gap-8 items-start mb-10">
        
        {/* Banner Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-wrap gap-2.5 items-center">
            {project.category && (
              <span className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide px-3 py-1">
                {project.category.name}
              </span>
            )}
            <span className={`rounded-lg border px-3 py-1 text-[10px] font-bold uppercase ${difficultyColors[project.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED']}`}>
              {project.difficulty}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {project.title}
          </h1>

          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200/50 dark:border-slate-800 py-4">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4.5 w-4.5 text-blue-500" />
              <span>Project Duration: {project.duration}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Download className="h-4.5 w-4.5 text-violet-500" />
              <span>Downloads logged: {project.downloadCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
              <span>Reviews score: {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0'} ({reviews.length})</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Preview Card */}
        <div className="lg:col-span-1 border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-md">
          <img src={project.image} alt={project.title} className="w-full aspect-video object-cover" />
          <div className="p-5 space-y-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`w-full inline-flex items-center justify-center rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${
                downloadSuccess 
                  ? 'bg-emerald-600 shadow-emerald-500/10' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/15 hover:shadow-blue-500/25'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  <span>Code Zip Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  <span>{downloading ? 'Downloading...' : 'Download Source Code'}</span>
                </>
              )}
            </button>
            <Link
              href="/request"
              className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <span>Need custom changes? Ask here</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200 dark:border-slate-800 mb-8 flex space-x-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'details', label: 'Overview', icon: FileText },
          { id: 'code', label: 'Source Code & Docs', icon: Download },
          { id: 'video', label: 'Demo Video', icon: Video },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'discussion', label: `Q&A Forum (${comments.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 pb-4 text-xs font-semibold border-b-2 transition-all ${
                isActive 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Panel Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Tab rendering */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Project Description</h3>
                <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {project.longDescription}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Key Features</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2.5 mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Screenshots Carousel representation */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Interface Screenshots</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.screenshots.map((shot: string, index: number) => (
                      <img key={index} src={shot} alt={`Screenshot ${index + 1}`} className="rounded-xl border border-slate-200 dark:border-slate-800 aspect-video object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-6 animate-in fade-in duration-300">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Submission Deliverables</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">All submissions packages contain source project scripts, local database structures, dependencies guidelines, and setup videos.</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Source Code Zip</h4>
                      <p className="text-[10px] text-slate-400">Code structure script files</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDownload}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Project Report (PDF)</h4>
                      <p className="text-[10px] text-slate-400">IEEE Synopsis & Report</p>
                    </div>
                  </div>
                  <a 
                    href={project.docUrl} 
                    className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                    onClick={() => toast('Mock IEEE Report PDF downloaded successfully!', 'success')}
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Project Demo Video</h3>
              {project.demoVideo ? (
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
                  <iframe 
                    className="w-full h-full"
                    src={project.demoVideo} 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900/30">
                  <Play className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
                  <p className="text-xs text-slate-400">Demo video is currently being recorded by our admin team. Check back soon!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Form */}
              {user ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Write a Review</h3>
                  
                  {reviewSuccess && (
                    <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 font-semibold">
                      {reviewSuccess}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-medium">Your Rating:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="text-amber-500 hover:scale-110 transition-transform"
                          >
                            <Star className={`h-5 w-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      placeholder="Share your experience working with this project source code..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 shadow-md shadow-blue-500/10"
                    >
                      {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 text-center text-xs text-slate-500">
                  Please <Link href="/login" className="text-blue-500 font-semibold hover:underline">sign in</Link> to review this academic project.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">No reviews yet. Be the first to download and review!</div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            <User className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold">{rev.user?.name || 'Anonymous Student'}</h4>
                            <p className="text-[9px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-0.5 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Comment Input */}
              {user ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ask a Question</h3>
                  <form onSubmit={(e) => handleCommentSubmit(e)} className="space-y-3.5">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      placeholder="Ask about compilation issues, circuit pins connection, or library upgrades..."
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={commentSubmitting}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 shadow-md"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      <span>Post Question</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 text-center text-xs text-slate-500">
                  Please <Link href="/login" className="text-blue-500 font-semibold hover:underline">sign in</Link> to join the compilation support thread.
                </div>
              )}

              {/* Discussion Thread */}
              <div className="space-y-5">
                {rootComments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">No questions posted yet. Have a doubt? Ask above!</div>
                ) : (
                  rootComments.map((comm) => {
                    const replies = getReplies(comm.id)
                    return (
                      <div key={comm.id} className="space-y-3.5">
                        
                        {/* Parent Comment */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-3 shadow-sm">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                                <User className="h-4 w-4 text-slate-400" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold">{comm.user?.name || 'Student'}</h4>
                                <p className="text-[9px] text-slate-400">{new Date(comm.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {user && replyTarget !== comm.id && (
                              <button
                                onClick={() => {
                                  setReplyTarget(comm.id)
                                  setReplyText('')
                                }}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Reply
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{comm.text}</p>
                        </div>

                        {/* Reply Form */}
                        {replyTarget === comm.id && (
                          <div className="ml-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl space-y-3.5">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              required
                              placeholder="Write reply..."
                              rows={2}
                              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleCommentSubmit(event as any, comm.id)}
                                className="bg-blue-600 text-white rounded-lg text-xs font-semibold px-3 py-1.5 shadow-sm"
                              >
                                Post Reply
                              </button>
                              <button
                                onClick={() => setReplyTarget(null)}
                                className="border border-slate-200 dark:border-slate-800 text-slate-500 rounded-lg text-xs font-semibold px-3 py-1.5"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {replies.map((reply) => (
                          <div key={reply.id} className="ml-10 flex space-x-3.5">
                            <CornerDownRight className="h-5 w-5 text-slate-300 dark:text-slate-700 flex-shrink-0 mt-2" />
                            <div className="flex-grow bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/40 dark:border-slate-800 p-4 space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center">
                                  <span>{reply.user?.name || 'Assistant'}</span>
                                  {reply.userId === 'admin-1' && (
                                    <span className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                      Staff
                                    </span>
                                  )}
                                </h4>
                                <span className="text-[9px] text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{reply.text}</p>
                            </div>
                          </div>
                        ))}

                      </div>
                    )
                  })
                )}
              </div>

            </div>
          )}

        </div>

        {/* Sidebar Info & Technologies */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Tech Stack */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 space-y-3.5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/35 dark:border-slate-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Guidelines info */}
          <div className="bg-gradient-to-tr from-blue-500/10 to-violet-500/10 rounded-2xl border border-blue-500/20 p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center">
              <Sparkles className="h-4.5 w-4.5 mr-2" />
              <span>Compilation Support</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Facing difficulties deploying this project locally? Post a comment in our compilation Q&A forum tab, or initiate a live Support Chat in the bottom right corner for immediate help.
            </p>
          </div>

        </div>

      </div>

      {/* Related Projects Grid */}
      {relatedProjects.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200/50 dark:border-slate-800">
          <h2 className="text-xl font-extrabold tracking-tight dark:text-white mb-6">Related Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProjects.map((rel) => (
              <ProjectCard key={rel.id} project={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

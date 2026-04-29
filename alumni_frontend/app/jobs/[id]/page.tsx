"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { jobAPI } from "@/lib/api"
import type { Job } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, User, AlertCircle, Trash2 } from "lucide-react"

export default function JobDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const jobId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : ""

  const computeApplied = (jobData: Job, userId?: string | null) => {
    if (!userId) return false

    const applicants = (jobData as any).applicants
    if (!Array.isArray(applicants)) return false

    return applicants.some((app: any) => {
      if (!app) return false
      // If backend stored just ObjectIds as strings
      if (typeof app === "string") return app === userId
      // If backend stored objects like { user: ObjectId }
      if (typeof app.user === "string") return app.user === userId
      // If populated: { user: { _id: string, ... } }
      if (app.user && typeof app.user._id === "string") return app.user._id === userId
      return false
    })
  }

  const fetchJob = useCallback(async () => {
    if (!jobId) return
    setLoading(true)
    setError(null)

    try {
      const res = await jobAPI.getById(jobId)
      // API returns { job: Job }
      const jobData = (res as any).job as Job
      setJob(jobData)
      setApplied(computeApplied(jobData, user?._id || null))
    } catch (err: any) {
      console.error("Failed to fetch job:", err)
      setJob(null)
      setError(err?.message || "Failed to fetch job details. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [jobId, user?._id])

  useEffect(() => {
    fetchJob()
  }, [fetchJob])

  const handleApply = async () => {
    if (!jobId) return
    setApplying(true)
    setApplyError(null)

    try {
      await jobAPI.apply(jobId)
      setApplied(true)

      setJob((prev) => {
        if (!prev || !user?._id) return prev

        const applicants = prev.applicants || []

        const alreadyApplied = applicants.some((app: any) => {
          if (!app) return false

          if (typeof app === "string") return app === user._id

          if (typeof app.user === "string") return app.user === user._id


          if (app.user && typeof app.user._id === "string") {
            return app.user._id === user._id
          }

          return false
        })

        return {
          ...prev,
          applicants: alreadyApplied
            ? applicants
            : [...applicants, { user: user._id }],
        }
      })

    } catch (err: any) {
      console.error("Failed to apply:", err)
      setApplyError(err?.message || "Failed to apply for this job. Please try again.")
    } finally {
      setApplying(false)
    }

    const handleDelete = async () => {
      if (!jobId) return
      if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return

      setDeleting(true)
      setDeleteError(null)

      try {
        await jobAPI.delete(jobId)
        router.push("/jobs")
      } catch (err: any) {
        console.error("Failed to delete job:", err)
        setDeleteError(err?.message || "Failed to delete this job. Please try again.")
      } finally {
        setDeleting(false)
      }
    }

    // Check if user can delete (admin or job owner)
    const canDelete =
      user &&
      job &&
      (
        user.role === "admin" ||
        (
          job.postedBy &&
          (
            typeof job.postedBy === "string"
              ? job.postedBy === user._id
              : job.postedBy._id === user._id
          )
        )
      )

    // ------------------ LOADING SKELETON ------------------
    if (loading) {
      return (
        <ProtectedRoute>
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-muted rounded" />
                    <div className="flex gap-4 mt-2">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-4 w-40 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-muted rounded" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-muted rounded" />
                  <div className="flex gap-2 flex-wrap">
                    <div className="h-6 w-16 bg-muted rounded-full" />
                    <div className="h-6 w-20 bg-muted rounded-full" />
                    <div className="h-6 w-24 bg-muted rounded-full" />
                  </div>
                </div>
                <div className="h-10 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
        </ProtectedRoute>
      )
    }

    // ------------------ ERROR STATE ------------------
    if (error) {
      return (
        <ProtectedRoute>
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Card className="border-destructive/30">
              <CardHeader className="flex flex-row items-center gap-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <div>
                  <CardTitle className="text-lg">Unable to load job</CardTitle>
                  <CardDescription>{error}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button variant="outline" onClick={fetchJob}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </ProtectedRoute>
      )
    }

    // ------------------ NOT FOUND ------------------
    if (!job) {
      return (
        <ProtectedRoute>
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Job not found</CardTitle>
                <CardDescription>
                  The job you&apos;re looking for may have been removed or is no longer available.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </ProtectedRoute>
      )
    }

    // ------------------ MAIN CONTENT ------------------
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {job.company}
                    </span>
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    )}
                    {job.postedBy && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Posted by{" "}
                        {typeof job.postedBy === "string"
                          ? "Unknown"
                          : job.postedBy.name}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge>{job.type}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.skillsRequired?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Skills Required</h3>
                  <div className="flex gap-2 flex-wrap">
                    {job.skillsRequired.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user?.role === "student" && (
                <div className="space-y-2">
                  <Button
                    onClick={handleApply}
                    disabled={applying || applied}
                    className="w-full"
                  >
                    {applied ? "Already Applied" : applying ? "Applying..." : "Apply Now"}
                  </Button>
                  {applyError && (
                    <p className="text-sm text-destructive text-center">{applyError}</p>
                  )}
                </div>
              )}

              {canDelete && (
                <div className="space-y-2 pt-4 border-t">
                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleting ? "Deleting..." : "Delete Job"}
                  </Button>
                  {deleteError && (
                    <p className="text-sm text-destructive text-center">{deleteError}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }
}

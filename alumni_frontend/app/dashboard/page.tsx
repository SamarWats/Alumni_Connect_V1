"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { dashboardAPI } from "@/lib/api"
import type { StudentDashboard, AlumniDashboard, AdminDashboard } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Calendar, Users, ArrowRight, Plus, TrendingUp, Award, Bell, BookOpen, GraduationCap, Building, Megaphone } from "lucide-react"
import { getRecommendedJobs, getRecommendedMentors } from "@/lib/api";


export default function DashboardPage() {
  const { user } = useAuth()

  const [stats, setStats] = useState<StudentDashboard | AlumniDashboard | AdminDashboard | null>(null)

  const [jobs, setJobs] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user) return;

      try {
        let data;

        // Dashboard stats
        if (user.role === "student") data = await dashboardAPI.getStudent();
        else if (user.role === "alumni") data = await dashboardAPI.getAlumni();
        else data = await dashboardAPI.getAdmin();

        setStats(data);

        // 🔥 ONLY FOR STUDENTS → AI FEATURES
        if (user.role === "student") {
          const token = localStorage.getItem("token");

          if (token) {
            const [jobsRes, mentorsRes] = await Promise.all([
              getRecommendedJobs(token),
              getRecommendedMentors(token),
            ]);

            setJobs(jobsRes);
            setMentors(mentorsRes);
          }
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const renderStudentDashboard = (data: StudentDashboard) => (
    <div className="grid gap-6 md:grid-cols-3">
      <Link href="/jobs/applied">
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span>Applied Jobs</span>
                </div>
                <div className="text-3xl font-bold">{data.appliedJobs}</div>
                <p className="text-xs text-muted-foreground mt-1">Applications sent</p>
              </div>
              <div className="w-20 h-20 mr-4">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <rect x="15" y="20" width="50" height="40" rx="4" fill="#3B82F6" opacity="0.2" />
                  <rect x="22" y="12" width="36" height="14" rx="3" fill="#3B82F6" opacity="0.3" />
                  <rect x="22" y="32" width="36" height="4" rx="1" fill="#3B82F6" />
                  <rect x="22" y="40" width="28" height="4" rx="1" fill="#3B82F6" opacity="0.5" />
                  <rect x="22" y="48" width="20" height="4" rx="1" fill="#3B82F6" opacity="0.3" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/connections">
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span>Connections</span>
                </div>
                <div className="text-3xl font-bold">{data.connections}</div>
                <p className="text-xs text-muted-foreground mt-1">Alumni connected</p>
              </div>
              <div className="w-20 h-20 mr-4">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="25" cy="35" r="10" fill="#22C55E" opacity="0.3" />
                  <circle cx="55" cy="35" r="10" fill="#22C55E" opacity="0.3" />
                  <circle cx="40" cy="55" r="10" fill="#22C55E" />
                  <line x1="32" y1="42" x2="36" y2="48" stroke="#22C55E" strokeWidth="2" />
                  <line x1="48" y1="42" x2="44" y2="48" stroke="#22C55E" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/events">
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Upcoming Events</span>
                </div>
                <div className="text-3xl font-bold">{data.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">Events registered</p>
              </div>
              <div className="w-20 h-20 mr-4">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <rect x="15" y="18" width="50" height="45" rx="4" fill="#A855F7" opacity="0.2" />
                  <rect x="15" y="18" width="50" height="12" rx="4" fill="#A855F7" />
                  <circle cx="25" cy="24" r="3" fill="white" />
                  <circle cx="55" cy="24" r="3" fill="white" />
                  <rect x="22" y="38" width="10" height="8" rx="2" fill="#A855F7" opacity="0.5" />
                  <rect x="35" y="38" width="10" height="8" rx="2" fill="#A855F7" opacity="0.5" />
                  <rect x="48" y="38" width="10" height="8" rx="2" fill="#A855F7" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )

  const renderAlumniDashboard = (data: AlumniDashboard) => (
    <div className="grid gap-6 md:grid-cols-3">
      <Link href="/jobs/posted">
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span>Jobs Posted</span>
                </div>
                <div className="text-3xl font-bold">{data.jobsPosted}</div>
                <p className="text-xs text-muted-foreground mt-1">Opportunities shared</p>
              </div>
              <div className="w-20 h-20 mr-4">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <rect x="15" y="25" width="50" height="35" rx="4" fill="#3B82F6" />
                  <rect x="28" y="18" width="24" height="10" rx="2" fill="#93C5FD" />
                  <circle cx="52" cy="38" r="8" fill="#22C55E" />
                  <path d="M49 38 L51 40 L55 36" stroke="white" strokeWidth="2" fill="none" />
                  <rect x="22" y="48" width="24" height="3" rx="1" fill="white" opacity="0.7" />
                  <rect x="22" y="53" width="16" height="3" rx="1" fill="white" opacity="0.5" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/jobs/posted">
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Events Created</span>
                </div>
                <div className="text-3xl font-bold">{data.eventsCreated}</div>
                <p className="text-xs text-muted-foreground mt-1">Events organized</p>
              </div>
              <div className="w-20 h-20 mr-4">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <rect x="15" y="20" width="50" height="45" rx="4" fill="#A855F7" />
                  <rect x="22" y="32" width="10" height="8" rx="2" fill="white" />
                  <rect x="35" y="32" width="10" height="8" rx="2" fill="white" />
                  <rect x="48" y="32" width="10" height="8" rx="2" fill="white" />
                  <rect x="22" y="45" width="10" height="8" rx="2" fill="white" opacity="0.7" />
                  <rect x="35" y="45" width="10" height="8" rx="2" fill="white" opacity="0.7" />
                  <circle cx="55" cy="22" r="10" fill="#F59E0B" />
                  <text x="55" y="26" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">+</text>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

        <Link href="/connections">
          <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span>Connections</span>
                  </div>
                  <div className="text-3xl font-bold">{data.connections}</div>
                  <p className="text-xs text-muted-foreground mt-1">Network members</p>
                </div>
                <div className="w-20 h-20 mr-4">
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="40" cy="30" r="12" fill="#22C55E" />
                    <circle cx="22" cy="52" r="8" fill="#22C55E" opacity="0.5" />
                    <circle cx="58" cy="52" r="8" fill="#22C55E" opacity="0.5" />
                    <line x1="40" y1="42" x2="25" y2="46" stroke="#22C55E" strokeWidth="2" />
                    <line x1="40" y1="42" x2="55" y2="46" stroke="#22C55E" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
    </div>
  )

  const renderAdminDashboard = (data: AdminDashboard) => (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-3 sm:p-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-80" />
            <div className="text-xl sm:text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs opacity-80">Total Users</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-3 sm:p-4">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-80" />
            <div className="text-xl sm:text-2xl font-bold">{data.students}</div>
            <p className="text-xs opacity-80">Students</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-3 sm:p-4">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-80" />
            <div className="text-xl sm:text-2xl font-bold">{data.alumni}</div>
            <p className="text-xs opacity-80">Alumni</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardContent className="p-3 sm:p-4">
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-80" />
            <div className="text-xl sm:text-2xl font-bold">{data.totalJobs}</div>
            <p className="text-xs opacity-80">Total Jobs</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white col-span-2 sm:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-80" />
            <div className="text-xl sm:text-2xl font-bold">{data.totalEvents}</div>
            <p className="text-xs opacity-80">Total Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Infographic */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2">Platform Overview</h3>
              <p className="text-sm text-muted-foreground">Managing the AlumniConnect community</p>
            </div>
            <svg viewBox="0 0 200 100" className="w-48 h-24">
              <rect x="10" y="70" width="25" height="20" rx="2" fill="#3B82F6" />
              <rect x="45" y="50" width="25" height="40" rx="2" fill="#22C55E" />
              <rect x="80" y="30" width="25" height="60" rx="2" fill="#A855F7" />
              <rect x="115" y="40" width="25" height="50" rx="2" fill="#F59E0B" />
              <rect x="150" y="20" width="25" height="70" rx="2" fill="#EC4899" />
              <path d="M22 65 L57 45 L92 25 L127 35 L162 15" stroke="#1E293B" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              <circle cx="22" cy="65" r="4" fill="#1E293B" />
              <circle cx="57" cy="45" r="4" fill="#1E293B" />
              <circle cx="92" cy="25" r="4" fill="#1E293B" />
              <circle cx="127" cy="35" r="4" fill="#1E293B" />
              <circle cx="162" cy="15" r="4" fill="#1E293B" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user?.name}!</h1>
                <p className="text-slate-400 mt-1 text-sm sm:text-base">Here&apos;s what&apos;s happening in your network.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base">
                  {user?.role === "student" && <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />}
                  {user?.role === "alumni" && <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />}
                  {user?.role === "admin" && <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />}
                  <span className="capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {stats && user && (
                <>
                  {user.role === "student" && renderStudentDashboard(stats as StudentDashboard)}
                  {user.role === "alumni" && renderAlumniDashboard(stats as AlumniDashboard)}
                  {user.role === "admin" && renderAdminDashboard(stats as AdminDashboard)}
                </>
              )}

              {user?.role === "student" && jobs.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Recommended Jobs for You
                  </h2>
                  <br />
                  <p className="text-sm text-muted-foreground mb-2">
                    Based on your profile and skills
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.slice(0, 3).map((job: any) => (
                      <Card key={job._id} className="hover:shadow-lg transition">
                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.company}</p>

                          {/* 🔥 Match Score */}
                          <div className="text-sm font-medium text-green-600">
                            {Math.round(job.matchScore * 100)}% match
                          </div>

                          <Link href={`/jobs/${job._id}`}>
                            <Button size="sm" className="mt-2 w-full">
                              View Job
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {user?.role === "student" && mentors.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Recommended Mentors
                  </h2>
                  <br />
                  <p className="text-sm text-muted-foreground mb-2">
                    Based on your profile and skills
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mentors.slice(0, 3).map((mentor: any) => (
                      <Card key={mentor.user._id} className="hover:shadow-lg transition">
                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-semibold text-lg">
                            {mentor.user.name}
                          </h3>

                          <p className="text-sm text-muted-foreground">
                            {mentor.profile?.headline || "Alumni"}
                          </p>

                          {/* 🔥 Match Score */}
                          <div className="text-sm font-medium text-green-600">
                            {mentor.matchScore} skill match
                          </div>

                          <Link href={`/profile/${mentor.user._id}`}>
                            <Button size="sm" className="mt-2 w-full">
                              View Profile
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}


              {/* Quick Actions */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user?.role === "student" ? (
                    <>
                      <Link href="/jobs">
                        <Card className="hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium">Browse Jobs</span>
                                <p className="text-xs text-muted-foreground">Find opportunities</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/events">
                        <Card className="hover:shadow-lg transition-all hover:border-purple-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Calendar className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <span className="font-medium">View Events</span>
                                <p className="text-xs text-muted-foreground">Join meetups</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/directory">
                        <Card className="hover:shadow-lg transition-all hover:border-green-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <Users className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <span className="font-medium">Find Alumni</span>
                                <p className="text-xs text-muted-foreground">Expand network</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                    </>
                  ) : user?.role === "alumni" ? (
                    <>
                      <Link href="/jobs/create">
                        <Card className="hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Plus className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium">Post a Job</span>
                                <p className="text-xs text-muted-foreground">Share opportunity</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/events/create">
                        <Card className="hover:shadow-lg transition-all hover:border-purple-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Calendar className="h-6 w-6 text-purple-600" />
                              </div>
                              <div>
                                <span className="font-medium">Create Event</span>
                                <p className="text-xs text-muted-foreground">Organize meetup</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/connections">
                        <Card className="hover:shadow-lg transition-all hover:border-green-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <Users className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <span className="font-medium">My Network</span>
                                <p className="text-xs text-muted-foreground">View connections</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/directory">
                        <Card className="hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium">Manage Users</span>
                                <p className="text-xs text-muted-foreground">View all members</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/announcements/create">
                        <Card className="hover:shadow-lg transition-all hover:border-amber-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                                <Megaphone className="h-6 w-6 text-amber-600" />
                              </div>
                              <div>
                                <span className="font-medium">New Announcement</span>
                                <p className="text-xs text-muted-foreground">Notify everyone</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/jobs">
                        <Card className="hover:shadow-lg transition-all hover:border-green-200 cursor-pointer group">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <Briefcase className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <span className="font-medium">View All Jobs</span>
                                <p className="text-xs text-muted-foreground">Manage postings</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
                          </CardContent>
                        </Card>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Getting Started */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Complete Your Profile</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get the most out of AlumniConnect by completing your profile and connecting with others.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link href="/profile">
                          <Button>Complete Profile</Button>
                        </Link>
                        <Link href="/directory">
                          <Button variant="outline">Explore Directory</Button>
                        </Link>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <svg viewBox="0 0 120 120" className="w-32 h-32">
                        <circle cx="60" cy="40" r="20" fill="#3B82F6" />
                        <rect x="30" y="70" width="60" height="40" rx="8" fill="#3B82F6" opacity="0.3" />
                        <circle cx="95" cy="30" r="15" fill="#22C55E" />
                        <path d="M88 30 L93 35 L102 24" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

import { useState } from 'react'
import { 
  BarChart3, 
  Clock, 
  DollarSign, 
  FileText, 
  Plus, 
  Settings, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in real app this would come from API
  const stats = {
    totalQuotes: 47,
    acceptedQuotes: 32,
    pendingQuotes: 12,
    totalRevenue: 89750,
    avgQuoteValue: 2807,
    acceptanceRate: 68
  }

  const recentQuotes = [
    {
      id: 1,
      client: "Johnson Residence",
      service: "Kitchen Electrical Rewiring",
      amount: 3240,
      status: "pending",
      date: "2024-01-15",
      daysOld: 2
    },
    {
      id: 2,
      client: "Miller Construction",
      service: "Office Building HVAC",
      amount: 15600,
      status: "accepted",
      date: "2024-01-14",
      daysOld: 3
    },
    {
      id: 3,
      client: "Brown Family Home",
      service: "Bathroom Plumbing Upgrade",
      amount: 4850,
      status: "draft",
      date: "2024-01-13",
      daysOld: 4
    },
    {
      id: 4,
      client: "Green Valley Apartments",
      service: "Unit 4B Electrical Panel",
      amount: 1920,
      status: "expired",
      date: "2024-01-10",
      daysOld: 7
    }
  ]

  const upcomingJobs = [
    {
      id: 1,
      client: "Miller Construction",
      service: "Office Building HVAC",
      startDate: "2024-01-20",
      progress: 0,
      status: "scheduled"
    },
    {
      id: 2,
      client: "Davis Residence",
      service: "Whole House Rewiring",
      startDate: "2024-01-18",
      progress: 35,
      status: "in-progress"
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      accepted: "bg-green-100 text-green-800 hover:bg-green-100",
      draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      expired: "bg-red-100 text-red-800 hover:bg-red-100",
      scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      "in-progress": "bg-purple-100 text-purple-800 hover:bg-purple-100"
    }
    return variants[status as keyof typeof variants] || variants.draft
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'expired':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your business.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/quotes/new')}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Quote
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Quotes</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.totalQuotes}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+12% this month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Acceptance Rate</p>
                      <p className="text-3xl font-bold text-slate-900">{stats.acceptanceRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={stats.acceptanceRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+28% this month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg Quote Value</p>
                      <p className="text-3xl font-bold text-slate-900">${stats.avgQuoteValue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+8% this month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white border border-slate-200">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="quotes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Recent Quotes
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Active Jobs
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={() => navigate('/quotes/new')}
                      className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                      variant="ghost"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      Create New Quote
                    </Button>
                    <Button 
                      className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                      variant="ghost"
                    >
                      <Users className="w-4 h-4 mr-3" />
                      Add New Client
                    </Button>
                    <Button 
                      className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                      variant="ghost"
                    >
                      <Calendar className="w-4 h-4 mr-3" />
                      Schedule Job
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Quote Accepted</p>
                        <p className="text-xs text-slate-600">Miller Construction - $15,600</p>
                      </div>
                      <span className="text-xs text-slate-500">2h ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">New Quote Created</p>
                        <p className="text-xs text-slate-600">Johnson Residence - $3,240</p>
                      </div>
                      <span className="text-xs text-slate-500">1d ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Quote Expiring Soon</p>
                        <p className="text-xs text-slate-600">Brown Family Home - 2 days left</p>
                      </div>
                      <span className="text-xs text-slate-500">2d ago</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQuotes.map((quote) => (
                      <motion.div
                        key={quote.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/quotes/edit/${quote.id}`)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            {getStatusIcon(quote.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{quote.client}</h3>
                            <p className="text-sm text-slate-600">{quote.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">${quote.amount.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">{quote.daysOld} days old</p>
                          </div>
                          <Badge className={getStatusBadge(quote.status)}>
                            {quote.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Active Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {upcomingJobs.map((job) => (
                      <div key={job.id} className="p-4 bg-white border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">{job.client}</h3>
                            <p className="text-sm text-slate-600">{job.service}</p>
                            <p className="text-xs text-slate-500">Start: {job.startDate}</p>
                          </div>
                          <Badge className={getStatusBadge(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        {job.progress > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Progress</span>
                              <span className="font-medium text-slate-900">{job.progress}%</span>
                            </div>
                            <Progress value={job.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Quote Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">This Month</span>
                        <span className="font-semibold text-slate-900">68% acceptance rate</span>
                      </div>
                      <Progress value={68} className="h-3" />
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">32</p>
                          <p className="text-xs text-slate-600">Accepted</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-600">12</p>
                          <p className="text-xs text-slate-600">Pending</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">3</p>
                          <p className="text-xs text-slate-600">Declined</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Monthly Growth</span>
                        <span className="font-semibold text-green-600">+28%</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">January</span>
                          <span className="font-medium text-slate-900">$89,750</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">December</span>
                          <span className="font-medium text-slate-900">$70,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">November</span>
                          <span className="font-medium text-slate-900">$65,800</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
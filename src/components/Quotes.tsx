import { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'

const Quotes = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const quotes = [
    {
      id: 1,
      client: "Johnson Residence",
      service: "Kitchen Electrical Rewiring",
      amount: 3240,
      status: "pending",
      date: "2024-01-15",
      validUntil: "2024-01-29"
    },
    {
      id: 2,
      client: "Miller Construction", 
      service: "Office Building HVAC",
      amount: 15600,
      status: "accepted",
      date: "2024-01-14",
      validUntil: "2024-01-28"
    },
    {
      id: 3,
      client: "Brown Family Home",
      service: "Bathroom Plumbing Upgrade", 
      amount: 4850,
      status: "draft",
      date: "2024-01-13",
      validUntil: "2024-01-27"
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      accepted: "bg-green-100 text-green-800 hover:bg-green-100",
      draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      expired: "bg-red-100 text-red-800 hover:bg-red-100"
    }
    return variants[status as keyof typeof variants] || variants.draft
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Quotes</h1>
              <p className="text-slate-600 mt-1">Manage all your quotes and proposals</p>
            </div>
            <Button 
              onClick={() => navigate('/quotes/new')}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Quote
            </Button>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search quotes by client or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quotes List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>All Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">#{quote.id}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{quote.client}</h3>
                        <p className="text-sm text-slate-600">{quote.service}</p>
                        <p className="text-xs text-slate-500">Created {quote.date} • Valid until {quote.validUntil}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${quote.amount.toLocaleString()}</p>
                        <Badge className={getStatusBadge(quote.status)}>
                          {quote.status}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/quotes/edit/${quote.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Quotes
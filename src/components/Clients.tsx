import { useState } from 'react'
import { Plus, Search, User, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Sidebar from '@/components/Sidebar'

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const clients = [
    {
      id: 1,
      name: "John Johnson",
      company: "Johnson Residence",
      email: "john@johnson.com",
      phone: "(555) 123-4567",
      address: "123 Oak Street, Springfield, IL",
      totalProjects: 3,
      totalValue: 8450,
      lastProject: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Miller",
      company: "Miller Construction",
      email: "sarah@millerconstruction.com", 
      phone: "(555) 987-6543",
      address: "456 Business Ave, Springfield, IL",
      totalProjects: 7,
      totalValue: 45200,
      lastProject: "2024-01-14"
    }
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
              <p className="text-slate-600 mt-1">Manage your client relationships</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <p className="text-sm text-slate-600">{client.company}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{client.address}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Total Projects</span>
                      <Badge variant="secondary">{client.totalProjects}</Badge>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Total Value</span>
                      <span className="text-sm font-semibold text-green-600">${client.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">Last Project</span>
                      <span className="text-sm text-slate-600">{client.lastProject}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Clients
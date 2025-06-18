import { useState } from 'react'
import { ArrowLeft, Plus, Save, Send, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'

interface QuoteItem {
  id: number
  description: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

const QuoteBuilder = () => {
  const navigate = useNavigate()
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    {
      id: 1,
      description: "Electrical outlet installation",
      category: "labor",
      quantity: 4,
      unit: "each",
      unitPrice: 85,
      total: 340
    }
  ])

  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })

  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    validUntil: ""
  })

  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      id: Date.now(),
      description: "",
      category: "labor",
      quantity: 1,
      unit: "each",
      unitPrice: 0,
      total: 0
    }
    setQuoteItems([...quoteItems, newItem])
  }

  const updateQuoteItem = (id: number, field: keyof QuoteItem, value: string | number) => {
    setQuoteItems(items => items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    }))
  }

  const removeQuoteItem = (id: number) => {
    setQuoteItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const getCategoryBadge = (category: string) => {
    const variants = {
      labor: "bg-blue-100 text-blue-800",
      materials: "bg-green-100 text-green-800",
      equipment: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800"
    }
    return variants[category as keyof typeof variants] || variants.other
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/quotes')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Create Quote</h1>
                <p className="text-slate-600 mt-1">Build a professional quote that wins more business</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Quote
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Quote Builder */}
            <div className="lg:col-span-2 space-y-8">
              {/* Client Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input 
                        id="clientName"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                        placeholder="Johnson Residence"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email *</Label>
                      <Input 
                        id="clientEmail"
                        type="email"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input 
                        id="clientPhone"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="validUntil">Quote Valid Until</Label>
                      <Input 
                        id="validUntil"
                        type="date"
                        value={projectInfo.validUntil}
                        onChange={(e) => setProjectInfo({...projectInfo, validUntil: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="clientAddress">Service Address</Label>
                    <Textarea 
                      id="clientAddress"
                      value={clientInfo.address}
                      onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                      placeholder="123 Main Street, City, State 12345"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input 
                      id="projectTitle"
                      value={projectInfo.title}
                      onChange={(e) => setProjectInfo({...projectInfo, title: e.target.value})}
                      placeholder="Kitchen Electrical Rewiring"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea 
                      id="projectDescription"
                      value={projectInfo.description}
                      onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
                      placeholder="Detailed description of the work to be performed..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Attachments</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">
                        Upload photos, plans, or reference materials
                      </p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Items */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Quote Items</CardTitle>
                  <Button onClick={addQuoteItem} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-slate-200 rounded-lg space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className={getCategoryBadge(item.category)}>
                            {item.category}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeQuoteItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4">
                          <div>
                            <Label>Description *</Label>
                            <Input 
                              value={item.description}
                              onChange={(e) => updateQuoteItem(item.id, 'description', e.target.value)}
                              placeholder="Describe the work or materials..."
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <Label>Category</Label>
                              <Select 
                                value={item.category}
                                onValueChange={(value) => updateQuoteItem(item.id, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="labor">Labor</SelectItem>
                                  <SelectItem value="materials">Materials</SelectItem>
                                  <SelectItem value="equipment">Equipment</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Quantity</Label>
                              <Input 
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuoteItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.1"
                              />
                            </div>
                            <div>
                              <Label>Unit Price</Label>
                              <Input 
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => updateQuoteItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <Label>Total</Label>
                              <Input 
                                value={item.total.toFixed(2)}
                                disabled
                                className="bg-slate-50"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quote Summary */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle>Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-600">
                      <p><strong>{quoteItems.length}</strong> items</p>
                      <p>Quote #{Math.floor(Math.random() * 10000)}</p>
                      <p>Created {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Quote Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-2 text-slate-600">
                    <p>Your quote will include:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Professional branding</li>
                      <li>• Detailed line items</li>
                      <li>• Clear terms & conditions</li>
                      <li>• Digital signature capture</li>
                      <li>• Online payment options</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuoteBuilder
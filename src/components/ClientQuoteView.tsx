import { useState } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Download, 
  CreditCard,
  Shield,
  Clock,
  User,

  FileText,
  Zap,
  Star,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { formatGBP, formatUKDate } from '@/lib/ukUtils'

interface QuoteItem {
  id: number
  description: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
  status: 'pending' | 'accepted' | 'declined' | 'modified'
  clientNotes?: string
  isOptional?: boolean
}

interface ContractorInfo {
  name: string
  company: string
  phone: string
  email: string
  certifications: string[]
  rating: number
  reviews: number
  insuranceAmount: string
}

const ClientQuoteView = () => {
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    {
      id: 1,
      description: "Electrical socket installation - 13A double socket with USB charging",
      category: "labour",
      quantity: 4,
      unit: "each",
      unitPrice: 85.00,
      total: 340.00,
      status: 'pending',
      isOptional: false
    },
    {
      id: 2,
      description: "LED downlight installation - 5W warm white IP65 rated",
      category: "labour",
      quantity: 8,
      unit: "each",
      unitPrice: 45.00,
      total: 360.00,
      status: 'pending',
      isOptional: false
    },
    {
      id: 3,
      description: "Kitchen under-cabinet LED strip lighting",
      category: "materials",
      quantity: 3,
      unit: "metre",
      unitPrice: 25.00,
      total: 75.00,
      status: 'pending',
      isOptional: true
    },
    {
      id: 4,
      description: "Smart dimmer switch upgrade",
      category: "materials",
      quantity: 2,
      unit: "each",
      unitPrice: 65.00,
      total: 130.00,
      status: 'pending',
      isOptional: true
    }
  ])

  const [currentStep] = useState(1)
  const [, setShowSignature] = useState(false)

  const contractorInfo: ContractorInfo = {
    name: "Mike Johnson",
    company: "Johnson Electrical Services Ltd",
    phone: "07123 456 789",
    email: "mike@johnsonelectrical.co.uk",
    certifications: ["NICEIC Approved Contractor", "Part P Certified", "18th Edition BS 7671"],
    rating: 4.9,
    reviews: 127,
    insuranceAmount: "£2,000,000"
  }

  const requiredItems = quoteItems.filter(item => !item.isOptional)
  const optionalItems = quoteItems.filter(item => item.isOptional)
  
  const acceptedItems = quoteItems.filter(item => item.status === 'accepted')

  const pendingItems = quoteItems.filter(item => item.status === 'pending')

  const totalAccepted = acceptedItems.reduce((sum, item) => sum + item.total, 0)
  const totalOriginal = quoteItems.reduce((sum, item) => sum + item.total, 0)
  const vatAmount = totalAccepted * 0.20
  const finalTotal = totalAccepted + vatAmount

  const completionPercentage = Math.round((acceptedItems.length / quoteItems.length) * 100)

  const updateItemStatus = (id: number, status: QuoteItem['status']) => {
    setQuoteItems(items => items.map(item => 
      item.id === id ? { ...item, status } : item
    ))
  }

  const addClientNote = (id: number, note: string) => {
    setQuoteItems(items => items.map(item => 
      item.id === id ? { ...item, clientNotes: note } : item
    ))
  }

  const getStatusBadge = (status: QuoteItem['status']) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      accepted: "bg-green-100 text-green-800 border-green-300",
      declined: "bg-red-100 text-red-800 border-red-300",
      modified: "bg-blue-100 text-blue-800 border-blue-300"
    }
    return variants[status]
  }

  const getStatusIcon = (status: QuoteItem['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'modified':
        return <MessageSquare className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const progressSteps = [
    { id: 1, title: "Review Quote", description: "Check all items and pricing" },
    { id: 2, title: "Make Decisions", description: "Accept, decline, or modify items" },
    { id: 3, title: "Finalize", description: "Review final price and sign" },
    { id: 4, title: "Payment", description: "Secure your booking with deposit" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Your Quote from {contractorInfo.company}</h1>
                <p className="text-sm text-slate-600">Kitchen Electrical Upgrade Project</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                {completionPercentage}% Complete
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Quote Completion Progress</h2>
              <span className="text-sm text-slate-600">
                {acceptedItems.length} of {quoteItems.length} decisions made
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3 mb-4" />
            <div className="grid grid-cols-4 gap-4">
              {progressSteps.map((step) => (
                <div key={step.id} className={`text-center ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step.id}
                  </div>
                  <p className="text-xs font-medium">{step.title}</p>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quote Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contractor Information */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Your Contractor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-700">MJ</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{contractorInfo.name}</h3>
                    <p className="text-slate-600 mb-2">{contractorInfo.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                      <span>{contractorInfo.phone}</span>
                      <span>{contractorInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(contractorInfo.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{contractorInfo.rating}</span>
                        <span className="text-sm text-slate-500">({contractorInfo.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {contractorInfo.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-600 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Insured {contractorInfo.insuranceAmount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Required Items */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Required Work</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {requiredItems.filter(item => item.status === 'accepted').length} of {requiredItems.length} accepted
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {requiredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-slate-200 rounded-lg bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{item.description}</h4>
                        <p className="text-sm text-slate-600">
                          {item.quantity} {item.unit} × {formatGBP(item.unitPrice)} = {formatGBP(item.total)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <Badge className={getStatusBadge(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={item.status === 'accepted' ? 'default' : 'outline'}
                        onClick={() => updateItemStatus(item.id, 'accepted')}
                        className={item.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant={item.status === 'declined' ? 'destructive' : 'outline'}
                        onClick={() => updateItemStatus(item.id, 'declined')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItemStatus(item.id, 'modified')}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Query
                      </Button>
                    </div>

                    {item.status === 'modified' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-slate-200"
                      >
                        <Label htmlFor={`note-${item.id}`} className="text-sm font-medium text-slate-700">
                          Your question or modification request:
                        </Label>
                        <Textarea
                          id={`note-${item.id}`}
                          placeholder="I'd like to discuss this item..."
                          value={item.clientNotes || ''}
                          onChange={(e) => addClientNote(item.id, e.target.value)}
                          className="mt-2"
                          rows={2}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Optional Items */}
            {optionalItems.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <span>Optional Upgrades</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {optionalItems.filter(item => item.status === 'accepted').length} selected
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-slate-600 mb-4">
                    These items are optional but recommended to complete your project:
                  </p>
                  {optionalItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-slate-200 rounded-lg bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{item.description}</h4>
                          <p className="text-sm text-slate-600">
                            {item.quantity} {item.unit} × {formatGBP(item.unitPrice)} = {formatGBP(item.total)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          <Badge className={getStatusBadge(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={item.status === 'accepted' ? 'default' : 'outline'}
                          onClick={() => updateItemStatus(item.id, 'accepted')}
                          className={item.status === 'accepted' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Add to Quote
                        </Button>
                        <Button
                          size="sm"
                          variant={item.status === 'declined' ? 'destructive' : 'outline'}
                          onClick={() => updateItemStatus(item.id, 'declined')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Not Needed
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quote Summary & Actions Sidebar */}
          <div className="space-y-6">
            {/* Final Quote Summary */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm sticky top-24">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Final Quote</span>
                  <Badge className="bg-white/20 text-white">
                    {acceptedItems.length} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal (ex VAT)</span>
                    <span className="font-medium">{formatGBP(totalAccepted)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">VAT (20%)</span>
                    <span className="font-medium">{formatGBP(vatAmount)}</span>
                  </div>
                  {totalAccepted !== totalOriginal && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Savings from original</span>
                      <span className="font-medium">-{formatGBP(totalOriginal - totalAccepted)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatGBP(finalTotal)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Deposit Required (30%)</span>
                      <span className="font-medium text-slate-900">{formatGBP(finalTotal * 0.30)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Secures your booking and materials
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  {pendingItems.length > 0 && (
                    <div className="flex items-center space-x-2 text-amber-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{pendingItems.length} items need your decision</span>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {pendingItems.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3"
                      >
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => setShowSignature(true)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept & Sign Quote
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Deposit Now
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-slate-700">Estimated Timeline</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">Within 2 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">2-3 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion:</span>
                  <span className="font-medium">Before {formatUKDate(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000))}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm text-slate-700">Questions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message {contractorInfo.name}
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Call {contractorInfo.phone}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientQuoteView
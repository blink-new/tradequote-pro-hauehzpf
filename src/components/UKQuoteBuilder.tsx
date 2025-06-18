import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Save, Send, Trash2, Upload, Calculator, FileText, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import { 
  formatGBP, 
  formatUKPhoneNumber, 
  formatUKPostcode, 
  validateUKPostcode,
  calculateVAT,
  UK_TRADE_CATEGORIES,
  VATCalculation 
} from '@/lib/ukUtils'

interface QuoteItem {
  id: number
  description: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  vatRate: number
  total: number
}

interface ClientInfo {
  name: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  county: string
  postcode: string
  vatNumber: string
}

interface ProjectInfo {
  title: string
  description: string
  validUntil: string
  tradeCategory: string
  requiresPartP: boolean
  requiresBuildingControl: boolean
}

const UKQuoteBuilder = () => {
  const navigate = useNavigate()
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    {
      id: 1,
      description: "Electrical socket installation - 13A double socket",
      category: "labour",
      quantity: 4,
      unit: "each",
      unitPrice: 85.00,
      vatRate: 20,
      total: 340.00
    }
  ])

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postcode: "",
    vatNumber: ""
  })

  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    title: "",
    description: "",
    validUntil: "",
    tradeCategory: "electrical",
    requiresPartP: false,
    requiresBuildingControl: false
  })

  const [vatCalculation, setVatCalculation] = useState<VATCalculation>({
    subtotal: 0,
    vatAmount: 0,
    vatRate: 20,
    total: 0
  })

  const [isVATRegistered, setIsVATRegistered] = useState(true)

  // Calculate totals whenever quote items change
  useEffect(() => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0)
    const calculation = isVATRegistered ? calculateVAT(subtotal, 20) : {
      subtotal,
      vatAmount: 0,
      vatRate: 0,
      total: subtotal
    }
    setVatCalculation(calculation)
  }, [quoteItems, isVATRegistered])

  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      id: Date.now(),
      description: "",
      category: "labour",
      quantity: 1,
      unit: "each",
      unitPrice: 0,
      vatRate: 20,
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

  const getCategoryBadge = (category: string) => {
    const variants = {
      labour: "bg-blue-100 text-blue-800 border-blue-200",
      materials: "bg-green-100 text-green-800 border-green-200", 
      plant: "bg-purple-100 text-purple-800 border-purple-200",
      subcontractor: "bg-orange-100 text-orange-800 border-orange-200",
      other: "bg-gray-100 text-gray-800 border-gray-200"
    }
    return variants[category as keyof typeof variants] || variants.other
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatUKPhoneNumber(value)
    setClientInfo({...clientInfo, phone: formatted})
  }

  const handlePostcodeChange = (value: string) => {
    const formatted = formatUKPostcode(value)
    setClientInfo({...clientInfo, postcode: formatted})
  }

  const isPostcodeValid = validateUKPostcode(clientInfo.postcode)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/quotes')}
                className="hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Create Professional Quote</h1>
                <p className="text-slate-600 mt-1">Build a compliant UK quote that wins more business</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25">
                <Send className="w-4 h-4 mr-2" />
                Send Quote
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Quote Builder */}
            <div className="lg:col-span-2 space-y-8">
              {/* UK Client Information */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>UK Client Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input 
                        id="clientName"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                        placeholder="Johnson Residence Ltd"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email Address *</Label>
                      <Input 
                        id="clientEmail"
                        type="email"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                        placeholder="john@example.co.uk"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">UK Phone Number</Label>
                      <Input 
                        id="clientPhone"
                        value={clientInfo.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="07xxx xxx xxx or 01xxx xxx xxx"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vatNumber">VAT Number (Optional)</Label>
                      <Input 
                        id="vatNumber"
                        value={clientInfo.vatNumber}
                        onChange={(e) => setClientInfo({...clientInfo, vatNumber: e.target.value})}
                        placeholder="GB123456789"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">UK Service Address</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                        <Input 
                          id="addressLine1"
                          value={clientInfo.addressLine1}
                          onChange={(e) => setClientInfo({...clientInfo, addressLine1: e.target.value})}
                          placeholder="123 High Street"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input 
                          id="addressLine2"
                          value={clientInfo.addressLine2}
                          onChange={(e) => setClientInfo({...clientInfo, addressLine2: e.target.value})}
                          placeholder="Flat 4A"
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Town/City *</Label>
                          <Input 
                            id="city"
                            value={clientInfo.city}
                            onChange={(e) => setClientInfo({...clientInfo, city: e.target.value})}
                            placeholder="Manchester"
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="county">County</Label>
                          <Input 
                            id="county"
                            value={clientInfo.county}
                            onChange={(e) => setClientInfo({...clientInfo, county: e.target.value})}
                            placeholder="Greater Manchester"
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <Label htmlFor="postcode">UK Postcode *</Label>
                        <div className="relative">
                          <Input 
                            id="postcode"
                            value={clientInfo.postcode}
                            onChange={(e) => handlePostcodeChange(e.target.value)}
                            placeholder="M1 1AA"
                            className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                              clientInfo.postcode && !isPostcodeValid ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                          />
                          {clientInfo.postcode && !isPostcodeValid && (
                            <p className="text-sm text-red-600 mt-1">Please enter a valid UK postcode</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UK Project Details */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>UK Project Details & Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="projectTitle">Project Title *</Label>
                      <Input 
                        id="projectTitle"
                        value={projectInfo.title}
                        onChange={(e) => setProjectInfo({...projectInfo, title: e.target.value})}
                        placeholder="Kitchen Electrical Upgrade - Socket & Lighting Installation"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tradeCategory">Trade Category</Label>
                        <Select 
                          value={projectInfo.tradeCategory}
                          onValueChange={(value) => setProjectInfo({...projectInfo, tradeCategory: value})}
                        >
                          <SelectTrigger className="border-slate-300 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(UK_TRADE_CATEGORIES).map(([key, category]) => (
                              <SelectItem key={key} value={key}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="validUntil">Quote Valid Until</Label>
                        <Input 
                          id="validUntil"
                          type="date"
                          value={projectInfo.validUntil}
                          onChange={(e) => setProjectInfo({...projectInfo, validUntil: e.target.value})}
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="projectDescription">Detailed Project Description</Label>
                      <Textarea 
                        id="projectDescription"
                        value={projectInfo.description}
                        onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
                        placeholder="Comprehensive description of electrical work including installation of new consumer unit, rewiring of kitchen circuits, installation of LED downlights and USB socket outlets. All work to comply with BS 7671:2018 and Part P Building Regulations."
                        rows={4}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* UK Compliance Checkboxes */}
                    <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-slate-900 flex items-center">
                        <Calculator className="w-4 h-4 mr-2 text-amber-600" />
                        UK Compliance Requirements
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="partP"
                            checked={projectInfo.requiresPartP}
                            onCheckedChange={(checked) => setProjectInfo({...projectInfo, requiresPartP: checked})}
                          />
                          <Label htmlFor="partP" className="text-sm">
                            Requires Part P Notification (Electrical work in kitchens, bathrooms, gardens)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="buildingControl"
                            checked={projectInfo.requiresBuildingControl}
                            onCheckedChange={(checked) => setProjectInfo({...projectInfo, requiresBuildingControl: checked})}
                          />
                          <Label htmlFor="buildingControl" className="text-sm">
                            Requires Building Control Approval
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Project Attachments</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">
                        Upload plans, photos, or specification documents
                      </p>
                      <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50">
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Quote Items */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <span>Quote Items & Pricing</span>
                  </CardTitle>
                  <Button onClick={addQuoteItem} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {quoteItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 border border-slate-200 rounded-lg space-y-4 hover:shadow-md transition-shadow bg-white"
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
                            <Label>Item Description *</Label>
                            <Input 
                              value={item.description}
                              onChange={(e) => updateQuoteItem(item.id, 'description', e.target.value)}
                              placeholder="e.g., Installation of 13A twin socket outlet with USB charging ports"
                              className="border-slate-300 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                              <Label>Category</Label>
                              <Select 
                                value={item.category}
                                onValueChange={(value) => updateQuoteItem(item.id, 'category', value)}
                              >
                                <SelectTrigger className="border-slate-300 focus:border-green-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="labour">Labour</SelectItem>
                                  <SelectItem value="materials">Materials</SelectItem>
                                  <SelectItem value="plant">Plant/Equipment</SelectItem>
                                  <SelectItem value="subcontractor">Subcontractor</SelectItem>
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
                                className="border-slate-300 focus:border-green-500 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <Label>Unit</Label>
                              <Select 
                                value={item.unit}
                                onValueChange={(value) => updateQuoteItem(item.id, 'unit', value)}
                              >
                                <SelectTrigger className="border-slate-300 focus:border-green-500">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="each">Each</SelectItem>
                                  <SelectItem value="hour">Hour</SelectItem>
                                  <SelectItem value="day">Day</SelectItem>
                                  <SelectItem value="metre">Metre</SelectItem>
                                  <SelectItem value="square_metre">m²</SelectItem>
                                  <SelectItem value="linear_metre">Linear m</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Unit Price (£)</Label>
                              <Input 
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => updateQuoteItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                min="0"
                                step="0.01"
                                className="border-slate-300 focus:border-green-500 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <Label>Total (£)</Label>
                              <Input 
                                value={formatGBP(item.total).replace('£', '')}
                                disabled
                                className="bg-slate-50 font-semibold text-slate-900"
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

            {/* Enhanced UK Quote Summary */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg sticky top-8 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-white">UK Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* VAT Toggle */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <Label htmlFor="vatRegistered" className="text-sm font-medium">
                      VAT Registered Business
                    </Label>
                    <Switch
                      id="vatRegistered"
                      checked={isVATRegistered}
                      onCheckedChange={setIsVATRegistered}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal (ex VAT)</span>
                      <span className="font-medium">{formatGBP(vatCalculation.subtotal)}</span>
                    </div>
                    
                    {isVATRegistered && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">VAT ({vatCalculation.vatRate}%)</span>
                        <span className="font-medium">{formatGBP(vatCalculation.vatAmount)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total (inc VAT)</span>
                      <span className="text-blue-600">{formatGBP(vatCalculation.total)}</span>
                    </div>
                    
                    {!isVATRegistered && (
                      <p className="text-xs text-slate-500">
                        * No VAT charged - below VAT threshold
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span className="font-medium">{quoteItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quote Ref:</span>
                      <span className="font-medium">UK-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <span className="font-medium">
                        {projectInfo.validUntil 
                          ? new Date(projectInfo.validUntil).toLocaleDateString('en-GB')
                          : '30 days'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UK Compliance Notice */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-sm text-amber-800">UK Compliance Notice</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-amber-700">
                  <p>This quote includes:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• VAT calculation (where applicable)</li>
                    <li>• UK trade regulations compliance</li>
                    <li>• Building regulations consideration</li>
                    <li>• Professional certification requirements</li>
                    <li>• GDPR compliant client data handling</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UKQuoteBuilder
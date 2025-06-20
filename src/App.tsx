import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/Dashboard'
import QuoteBuilder from '@/components/QuoteBuilder'
import UKQuoteBuilder from '@/components/UKQuoteBuilder'
import ClientQuoteView from '@/components/ClientQuoteView'
import Quotes from '@/components/Quotes'
import Clients from '@/components/Clients'
import Settings from '@/components/Settings'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/quotes/new" element={<UKQuoteBuilder />} />
          <Route path="/quotes/builder" element={<QuoteBuilder />} />
          <Route path="/quotes/edit/:id" element={<UKQuoteBuilder />} />
          <Route path="/quotes/client/:id" element={<ClientQuoteView />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
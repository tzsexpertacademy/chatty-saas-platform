import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { InstanceDetail } from './pages/InstanceDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/instance/:id" element={<InstanceDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProductShowcase from './components/ProductShowcase'
import TestPage from './pages/TestPage'

export default function App() {
  return (
    <HashRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={
            <main className="app-viewport">
              <ProductShowcase standalone />
            </main>
          }
        />
        <Route path="/test" element={<TestPage />} />
        {/* Fallback to Home for any unrecognized path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

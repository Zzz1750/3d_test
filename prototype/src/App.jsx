import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProductShowcase from './components/ProductShowcase'

export default function App() {
  return (
    <BrowserRouter>
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
        {/* Wildcard / sub-routes fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

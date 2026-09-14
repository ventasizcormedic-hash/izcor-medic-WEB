import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { CategoryDetail } from './pages/CategoryDetail';
import { BrandsDirectory } from './pages/BrandsDirectory';
import { BrandDetail } from './pages/BrandDetail';
import { Contact } from './pages/Contact';
import { Quote } from './pages/Quote';
import { Admin } from './pages/Admin';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuoteProvider } from './context/QuoteContext';
import { HelmetProvider } from 'react-helmet-async';

export function App() {
  return (
    <HelmetProvider>
      <QuoteProvider>
        <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-slate-900 font-sans antialiased">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Catalog />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/productos/:slug" element={<ProductDetail />} />
              <Route path="/producto/:slug" element={<ProductDetail />} />
              <Route path="/categorias/:slug" element={<CategoryDetail />} />
              <Route path="/marcas" element={<BrandsDirectory />} />
              <Route path="/marcas/:idOrSlug" element={<BrandDetail />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/cotizar" element={<Quote />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </QuoteProvider>
    </HelmetProvider>
  );
}

export default App;

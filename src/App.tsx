import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import PopularVideos from './components/PopularVideos';
import BrowseByTopic from './components/BrowseByTopic';
import FeaturedCompanies from './components/FeaturedCompanies';
import UpcomingEvents from './components/UpcomingEvents';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import VideosPage from './components/VideosPage';
import CompaniesPage from './components/CompaniesPage';
import ProductsPage from './components/ProductsPage';
import EventsPage from './components/EventsPage';
import NewsPage from './components/NewsPage';
import AboutPage from './components/AboutPage';
import PartnerPage from './components/PartnerPage';
import ContactPage from './components/ContactPage';
import SearchPage from './components/SearchPage';
import ProductDetailPage from './components/ProductDetailPage';
import ProfessionalsPage from './components/ProfessionalsPage';
import ServicesPage from './components/ServicesPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import ScrollingFooter from './components/ScrollingFooter';
import GalleryPage from './components/GalleryPage';
import GalleryGlimpse from './components/GalleryGlimpse';
import SubApp from './components/webbuilder/src/App';
import OurPartners from './components/Ourpartners';
import GalleryPage1 from './components/GalleryPage1'
import Select from './components/buildWeb/src/components/select-template/select';
import Template2 from './components/buildWeb/src/components/template/t2/src/main';
import Form from "./components/buildWeb/src/components/form/src/main";
import EditTemp2 from "./components/buildWeb/src/components/template/t2/edit/src/main";
import Templale1 from "./components/buildWeb/src/components/template/t1/src/main";
import {CombinedProviders} from "./components/context/context"
import CompanyDirectory from "./components/CompanyDirectory"
import Login from './components/login';
import ForgotPassword from './components/ForgotPassword';
import Logout from './components/Logout';
import ResetPassword from './components/resetPassword';
import ProtectedRoute from './components/ProtectedRoute';
const HomePage = () => (
  <>
    <Hero />
    <PopularVideos />
    <UpcomingEvents />
    <BrowseByTopic />
    <FeaturedCompanies />
    <OurPartners />
    <GalleryGlimpse />
    <Newsletter />
  </>
);

const AppContent = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/company');

  return (
    <div className="min-h-screen">
      <CombinedProviders>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/professionals" element={<ProfessionalsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/user/companies" element={
          <ProtectedRoute>
                   <CompanyDirectory/>
          </ProtectedRoute>
          }/>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/gallery" element={<GalleryPage />} />            
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/company/*" element={<SubApp />} />
        <Route path="/user/companies/template-selection" element={<Select />} />
        <Route path="/template/t2" element={<Template2 />} />
        <Route path="/form" element={
          <ProtectedRoute>
            <Form />
          </ProtectedRoute>
          } />
        <Route path="/edit/template/t1" element={<Templale1 />} />
        <Route path="/edit/template/t2" element={<EditTemp2 />} />
        {/* login functionality */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="reset-password/:id" element={<ResetPassword />}/>
      </Routes>
      {!hideFooter && <Footer />}
      <ScrollingFooter />
      </CombinedProviders>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

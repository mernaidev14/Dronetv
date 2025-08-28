import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import UsedBy from "./components/UsedBy";
import About from "./components/About";
import Services from "./components/Services";
import Products from "./components/Products";
import Blog from "./components/Blog";
import BlogModal from "./components/BlogModal";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
// In your _app.js or _app.tsx
// import "./styles/hamburger-fix.css";

export default function App() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  // Set initial dark mode state based on user's system preference

  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header />
      <Hero />
      <UsedBy />
      <About />
      <Services />
      <Products />
      <Blog onSelectBlog={setSelectedBlog} />
      {selectedBlog && (
        <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

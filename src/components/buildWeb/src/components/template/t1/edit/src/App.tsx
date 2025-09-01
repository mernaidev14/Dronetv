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
import { useAuth } from "../../../../../../../context/context";
// import { useEffect } from "react";

export default function App() {
  const { AIGenData } = useAuth();

  useEffect(() => {
    console.log("AIgen:", AIGenData);
  }, []);
  const [selectedBlog, setSelectedBlog] = useState(null);
  // Set initial dark mode state based on user's system preference

  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header />
      <Hero heroData={AIGenData.content.hero} />
      <UsedBy />
      <About aboutData={AIGenData.content.about} />
      <Services serviceData={AIGenData.content.services} />
      <Products productData={AIGenData.content.products} />
      <Blog onSelectBlog={setSelectedBlog} blogData={AIGenData.content.blog} />
      {selectedBlog && (
        <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
      <Testimonials content={AIGenData.content.testimonials} />
      <Contact />
      <Footer />
    </div>
  );
}

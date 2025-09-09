import { useEffect, useState, useCallback } from "react";
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
import Publish from "./components/Publish";
import { useTemplate } from "../../../../../../../context/context";
// import { useEffect } from "react";

export default function App() {
  const { AIGenData, setFinalTemplate } = useTemplate();
  const [componentStates, setComponentStates] = useState({});

  // Memoize the collectComponentState function
  const collectComponentState = useCallback((componentName, state) => {
    setComponentStates((prev) => ({
      ...prev,
      [componentName]: state,
    }));
  }, []);

  // Update finalTemplate whenever componentStates changes
  useEffect(() => {
    setFinalTemplate((prev) => ({
      ...prev,
      publishedId: AIGenData.publishedId,
      userId: AIGenData.userId,
      draftId: AIGenData.draftId,
      templateSelection: AIGenData.templateSelection,
      content: {
        ...prev.content,
        ...componentStates,
      },
    }));
  }, [componentStates, setFinalTemplate, AIGenData]);

  const [selectedBlog, setSelectedBlog] = useState(null);
  // Set initial dark mode state based on user's system preference

  return (
    // The className here is no longer needed as the useEffect handles the root element
    <div>
      <Header
        headerData={AIGenData.content.company}
        onStateChange={useCallback((state) => collectComponentState("header", state),[collectComponentState])}
        publishedId={AIGenData.publishedId}
        userId={AIGenData.userId}
        templateSelection={AIGenData.templateSelection}
      />
      <Hero
        heroData={AIGenData.content.hero}
        onStateChange={useCallback((state) => collectComponentState("hero", state),[collectComponentState])}
        publishedId={AIGenData.publishedId}
        userId={AIGenData.userId}
        templateSelection={AIGenData.templateSelection}
      />
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
      <Publish />
      <Footer />
    </div>
  );
}

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Product from "./components/Product";
import Blog from "./components/Blog";
import Testimonials from "./components/Testimonials";
import Clients from "./components/Clients";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuth } from "../../../../../../../context/context";
import { useEffect, useState, useCallback } from "react"; // Add useCallback
import Publish from "./components/publish";

export default function App() {
  const { AIGenData, isPublishedTrigured, setFinalTemplate } = useAuth();
  const [componentStates, setComponentStates] = useState({});

  // Memoize the collectComponentState function
  const collectComponentState = useCallback((componentName, state) => {
    setComponentStates(prev => ({
      ...prev,
      [componentName]: state
    }));
  }, []);



  // When isPublishedTrigured becomes true, update finalTemplate
  useEffect(() => {
    if (isPublishedTrigured) {
      setFinalTemplate(prev => ({
        ...prev,
        publishedId: AIGenData.publishedId,
         userId: AIGenData.userId,
         draftId: AIGenData.draftId,
         templateSelection: AIGenData.templateSelection,
        content: {
          ...prev.content,
          ...componentStates
        }
      }));
    }
  }, [isPublishedTrigured, componentStates, setFinalTemplate]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header 
          headerData={AIGenData.content.company}
          onStateChange={useCallback((state) => collectComponentState('header', state), [collectComponentState])}
        />
        <main>
          <Hero 
            heroData={AIGenData.content.hero}
            onStateChange={useCallback((state) => collectComponentState('hero', state), [collectComponentState])}
          />
          <About 
            aboutData={AIGenData.content.about}
            onStateChange={useCallback((state) => collectComponentState('about', state), [collectComponentState])}
          />
          <Services 
            serviceData={AIGenData.content.services}
            onStateChange={useCallback((state) => collectComponentState('services', state), [collectComponentState])}
          />
          <Product 
            productData={AIGenData.content.products}
            onStateChange={useCallback((state) => collectComponentState('products', state), [collectComponentState])}
          />
          <Blog 
            blogData={AIGenData.content.blog}
            onStateChange={useCallback((state) => collectComponentState('blog', state), [collectComponentState])}
          />
          <Testimonials 
            testimonialsData={AIGenData.content.testimonials}
            onStateChange={useCallback((state) => collectComponentState('testimonials', state), [collectComponentState])}
          />
          <Clients 
            clientData={AIGenData.content.clients}
            onStateChange={useCallback((state) => collectComponentState('clients', state), [collectComponentState])}
          />
          <Contact 
            onStateChange={useCallback((state) => collectComponentState('contact', state), [collectComponentState])}
          />
          <Publish/>
        </main>
        <Footer 
          onStateChange={useCallback((state) => collectComponentState('footer', state), [collectComponentState])}
        />
      </div>
    </ThemeProvider>
  );
}

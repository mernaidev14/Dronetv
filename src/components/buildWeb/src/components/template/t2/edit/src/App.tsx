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
import { useEffect } from "react";
export default function App() {

const {AIGenData} = useAuth()

useEffect(()=>{
  console.log("AIgen:", AIGenData);
  
},[])
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header />
        <main>
          <Hero 
           heroData = {AIGenData.content.hero}
          />
          <About 
          aboutData = {AIGenData.content.about}
          />
          <Services 
          serviceData = {AIGenData.content.services}
          />
          <Product 
           productData = {AIGenData.content.products}
          />
          <Blog 
          blogData = {AIGenData.content.blog}
          />
          <Testimonials
          testimonialsData= {AIGenData.content.testimonials}
          />
          <Clients 
          clientData = {AIGenData.content.clients}
          />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
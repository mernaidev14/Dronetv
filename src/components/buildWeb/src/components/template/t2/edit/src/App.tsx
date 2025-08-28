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

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Product />
          <Blog />
          <Testimonials />
          <Clients />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
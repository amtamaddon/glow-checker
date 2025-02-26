
import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet, Search, Calendar, Plus } from "lucide-react";
import Header from "@/components/Header";

// Lazy load components that aren't needed immediately
const Features = lazy(() => import("./components/Features"));
const CTASection = lazy(() => import("./components/CTASection"));
const Footer = lazy(() => import("./components/Footer"));

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    // Mark as loaded after a short delay to ensure initial rendering is complete
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Clean up event listeners and timers
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);
  
  // Simple loading state for mobile
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <Droplet className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-medium mb-2">GlowChecker</h2>
            <p className="text-muted-foreground">Loading your skincare assistant...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section - Simplified for mobile */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 -z-10" />
          
          <div className="container max-w-6xl mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
                  Check if your skincare products actually <span className="text-accent">work</span>
                </h1>
              </div>
              
              <p 
                className="mt-6 text-lg leading-relaxed text-muted-foreground opacity-0 animate-fade-in"
                style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
              >
                Analyze ingredients, build effective routines, and discover what truly benefits your skin without wasting money on ineffective products.
              </p>
              
              <div 
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in"
                style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
              >
                <Button 
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground btn-hover-effect"
                  onClick={() => navigate("/analyze")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your Products
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-accent text-foreground hover:bg-accent/10 btn-hover-effect"
                  onClick={() => navigate("/routines")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Build a Routine
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section - Lazy loaded */}
        <Suspense fallback={<div className="py-20 flex justify-center"><Droplet className="animate-pulse h-8 w-8 text-accent" /></div>}>
          <Features />
        </Suspense>
        
        {/* CTA Section - Lazy loaded */}
        <Suspense fallback={<div className="py-10"></div>}>
          <CTASection navigate={navigate} />
        </Suspense>
      </main>
      
      {/* Footer - Lazy loaded */}
      <Suspense fallback={<div className="border-t py-6"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;

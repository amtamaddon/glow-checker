
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet, Search, Calendar, Plus, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    setIsLoaded(true);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 -z-10" />
          
          <div className="container max-w-6xl mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <div className={cn(
                "transition-all duration-700 ease-out",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
                  Check if your skincare products actually <span className="text-accent">work</span>
                </h1>
              </div>
              
              <p className={cn(
                "mt-6 text-lg leading-relaxed text-muted-foreground transition-all duration-700 delay-200 ease-out",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                Analyze ingredients, build effective routines, and discover what truly benefits your skin without wasting money on ineffective products.
              </p>
              
              <div className={cn(
                "mt-8 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-400 ease-out",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
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
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-medium">How It Works</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                GlowChecker makes it easy to understand what's in your products and how to use them effectively
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "glass-card p-6 rounded-xl transition-all duration-700 ease-out",
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                    `delay-[${index * 200}ms]`
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    feature.bgColor
                  )}>
                    <feature.icon className={cn("h-6 w-6", feature.iconColor)} />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button 
                    variant="link" 
                    className="mt-4 p-0 h-auto text-foreground hover:text-accent"
                    onClick={() => navigate(feature.path)}
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <CTASection navigate={navigate} />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

const features = [
  {
    title: "Analyze Ingredients",
    description: "Scan or input your product ingredients to understand what's beneficial and what might be causing issues.",
    icon: Search,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-700",
    path: "/analyze"
  },
  {
    title: "Build Your Routine",
    description: "Create personalized morning and evening routines with the optimal order for maximum efficacy.",
    icon: Calendar,
    bgColor: "bg-accent/30",
    iconColor: "text-accent-foreground",
    path: "/routines"
  },
  {
    title: "Track Results",
    description: "Monitor your skin's progress and adjust your routine based on what's working for your unique needs.",
    icon: Droplet,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-700",
    path: "/analyze"
  }
];

export default Index;

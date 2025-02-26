
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet, Search, Calendar, Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
                  Check if your skincare products actually <span className="text-accent">work</span>
                </h1>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg leading-relaxed text-muted-foreground"
              >
                Analyze ingredients, build effective routines, and discover what truly benefits your skin without wasting money on ineffective products.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
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
              </motion.div>
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-accent/20 to-secondary/20 p-8 md:p-12">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-medium mb-4">
                    Ready to optimize your skincare routine?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Start by adding your current products and get personalized recommendations for the perfect routine.
                  </p>
                  <Button 
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground btn-hover-effect"
                    onClick={() => navigate("/analyze")}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Your Products
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Droplet className="h-5 w-5 text-accent" />
              <span className="font-serif">glow</span>
              <span className="text-muted-foreground">checker</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GlowChecker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
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

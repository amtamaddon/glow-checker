
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet, Search, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-background/80 backdrop-blur-sm shadow-sm">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="text-2xl font-semibold flex items-center gap-2">
              <Droplet className="h-6 w-6 text-accent" />
              <span className="font-serif">glow</span>
              <span className="text-muted-foreground">checker</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 pt-24 pb-10">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Simple Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-medium">
              Check if your skincare products actually <span className="text-accent">work</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Analyze ingredients, build effective routines, and discover what truly benefits your skin.
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate("/analyze")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Products
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/routines")}
                className="border-accent text-foreground hover:bg-accent/10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Build Routine
              </Button>
            </div>
          </div>
          
          {/* Simple Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border p-5 rounded-lg bg-card"
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  feature.bgColor
                )}>
                  <feature.icon className={cn("h-5 w-5", feature.iconColor)} />
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="border-t py-5">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-3 md:mb-0">
              <Droplet className="h-4 w-4 text-accent" />
              <span className="font-serif">glow</span>
              <span className="text-muted-foreground">checker</span>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GlowChecker
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
    description: "Understand what's beneficial and what might be causing issues.",
    icon: Search,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-700",
    path: "/analyze"
  },
  {
    title: "Build Your Routine",
    description: "Create personalized routines with optimal order for maximum efficacy.",
    icon: Calendar,
    bgColor: "bg-accent/30",
    iconColor: "text-accent-foreground",
    path: "/routines"
  },
  {
    title: "Track Results",
    description: "Monitor your skin's progress and adjust your routine.",
    icon: Droplet,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-700",
    path: "/analyze"
  }
];

export default Index;


import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { features } from "./featureData";

const Features = () => {
  const navigate = useNavigate();
  
  return (
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

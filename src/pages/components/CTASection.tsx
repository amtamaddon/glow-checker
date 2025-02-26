
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";

interface CTASectionProps {
  navigate: NavigateFunction;
}

const CTASection = ({ navigate }: CTASectionProps) => {
  return (
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
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground btn-hover-effect"
                  onClick={() => navigate("/analyze")}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Your Products
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-accent text-foreground hover:bg-accent/10 btn-hover-effect"
                  onClick={() => navigate("/routines")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Build Your Routine
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

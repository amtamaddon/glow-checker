
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCw, Zap, AlertTriangle } from "lucide-react";
import { Product } from "@/lib/productData";
import { analyzeProduct } from "@/lib/perplexityService";
import { Skeleton } from "@/components/ui/skeleton";

interface AIAnalysisProps {
  product: Product;
}

const AIAnalysis = ({ product }: AIAnalysisProps) => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const generateAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingTime(0);
    const startTime = Date.now();
    
    // Start loading time counter
    const loadingInterval = setInterval(() => {
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    try {
      const ingredientNames = product.ingredients.map(ing => ing.name);
      const result = await analyzeProduct(product.name, ingredientNames);
      clearInterval(loadingInterval);
      setAnalysis(result);
    } catch (err) {
      clearInterval(loadingInterval);
      console.error("Error generating analysis:", err);
      setError("Unable to analyze this product. Please try again later.");
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze this product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsFirstLoad(false);
    }
  };

  // Reset state when product changes
  useEffect(() => {
    setAnalysis(null);
    setError(null);
    setIsFirstLoad(true);
  }, [product.id]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          AI Product Analysis
        </CardTitle>
        <CardDescription>
          Get an in-depth analysis of this product powered by AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <RotateCw className="h-8 w-8 animate-spin text-accent" />
            <div className="text-center space-y-2">
              <p className="text-sm">
                Analyzing {product.name}
                {loadingTime > 0 && loadingTime < 20 && <span> ({loadingTime}s)</span>}
                {loadingTime >= 20 && <span> (This is taking longer than usual)</span>}
              </p>
              <div className="space-y-2 mt-4 w-full max-w-md mx-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
                <Skeleton className="h-4 w-4/6 mx-auto" />
              </div>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-4 animate-fade-in">
            <div className="prose prose-sm max-w-none">
              {analysis.split('\n').map((paragraph, i) => 
                paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
              )}
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateAnalysis}
              >
                Regenerate Analysis
              </Button>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-destructive" />
            <h3 className="font-medium mb-2 text-destructive">Analysis Error</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error}
            </p>
            <Button 
              variant="outline"
              onClick={generateAnalysis}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Zap className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Analysis Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get an AI-powered analysis of this product's benefits and potential concerns
            </p>
            <Button 
              onClick={generateAnalysis}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isFirstLoad ? "Analyze Product" : "Generate Analysis"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;

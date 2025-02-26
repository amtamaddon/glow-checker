
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCw, Zap, AlertTriangle } from "lucide-react";
import { Product } from "@/lib/productData";
import { analyzeProduct } from "@/lib/perplexityService";

interface AIAnalysisProps {
  product: Product;
}

const AIAnalysis = ({ product }: AIAnalysisProps) => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ingredientNames = product.ingredients.map(ing => ing.name);
      const result = await analyzeProduct(product.name, ingredientNames);
      setAnalysis(result);
    } catch (err) {
      console.error("Error generating analysis:", err);
      setError("Unable to analyze this product. Please try again later.");
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze this product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when product changes
  useEffect(() => {
    setAnalysis(null);
    setError(null);
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
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <RotateCw className="h-8 w-8 animate-spin text-accent" />
            <p className="text-center text-sm text-muted-foreground">
              Analyzing {product.name}...
            </p>
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
          <div className="text-center py-8">
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
          <div className="text-center py-8">
            <Zap className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Analysis Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get an AI-powered analysis of this product's benefits and potential concerns
            </p>
            <Button 
              onClick={generateAnalysis}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Analyze Product
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysis;

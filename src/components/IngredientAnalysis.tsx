
import { useEffect, useState } from "react";
import { Product, Ingredient, analyzeIngredients } from "@/lib/productData";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface IngredientAnalysisProps {
  product: Product;
}

const IngredientAnalysis = ({ product }: IngredientAnalysisProps) => {
  const [analysis, setAnalysis] = useState<{
    beneficial: Ingredient[];
    concerning: Ingredient[];
    summary: string;
  } | null>(null);
  
  const [animateProgress, setAnimateProgress] = useState(false);
  
  useEffect(() => {
    // Analyze ingredients when product changes
    const result = analyzeIngredients(product.ingredients);
    setAnalysis(result);
    
    // Trigger progress animation
    setTimeout(() => {
      setAnimateProgress(true);
    }, 300);
    
    return () => {
      setAnimateProgress(false);
    };
  }, [product]);
  
  if (!analysis) return null;
  
  const safetyScore = Math.round(
    ((product.ingredients.length - analysis.concerning.length) / product.ingredients.length) * 100
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Info className="h-5 w-5 mr-2 text-accent" />
            Safety Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-1 text-sm">
            <span>Based on ingredient analysis</span>
            <span className="font-medium">{safetyScore}%</span>
          </div>
          <Progress 
            value={animateProgress ? safetyScore : 0} 
            className="h-2 transition-all duration-1000"
          />
          
          <p className="mt-4 text-sm text-muted-foreground">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={cn(
          "border-l-4",
          analysis.beneficial.length > 0 ? "border-l-green-500" : "border-l-gray-300"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Beneficial Ingredients
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                {analysis.beneficial.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.beneficial.length > 0 ? (
              <ul className="space-y-3">
                {analysis.beneficial.map((ingredient, index) => (
                  <li key={index} className="group animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <div>
                        <span className="font-medium">{ingredient.name}</span>
                        <p className="text-sm text-muted-foreground">{ingredient.purpose}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No beneficial ingredients detected.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className={cn(
          "border-l-4",
          analysis.concerning.length > 0 ? "border-l-amber-500" : "border-l-gray-300"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              Potential Concerns
              <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200">
                {analysis.concerning.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.concerning.length > 0 ? (
              <ul className="space-y-3">
                {analysis.concerning.map((ingredient, index) => (
                  <li key={index} className="group animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 shrink-0" />
                      <div>
                        <span className="font-medium">{ingredient.name}</span>
                        <p className="text-sm text-muted-foreground">{ingredient.purpose}</p>
                        {ingredient.concern && (
                          <p className="text-sm text-amber-600">Note: {ingredient.concern}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No concerning ingredients found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IngredientAnalysis;

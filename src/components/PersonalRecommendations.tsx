
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RotateCw, Sparkles, User } from "lucide-react";
import { commonSkinConcerns } from "@/lib/productData";
import { getProductRecommendations } from "@/lib/perplexityService";

const PersonalRecommendations = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  
  // Form state
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  
  const handleConcernToggle = (concern: string) => {
    if (concerns.includes(concern)) {
      setConcerns(concerns.filter((c) => c !== concern));
    } else {
      setConcerns([...concerns, concern]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skinType) {
      toast({
        title: "Missing information",
        description: "Please select your skin type",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setRecommendations(null);
    
    try {
      const result = await getProductRecommendations(skinType, concerns, budget);
      setRecommendations(result);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast({
        title: "Recommendation failed",
        description: "We couldn't generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Personal Recommendations
        </CardTitle>
        <CardDescription>
          Get personalized product recommendations based on your skin type and concerns
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {recommendations ? (
          <div className="space-y-4 animate-fade-in">
            <div className="prose prose-sm max-w-none">
              {recommendations.split('\n').map((paragraph, i) => 
                paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
              )}
            </div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setRecommendations(null)}
            >
              Start Over
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="skinType">Skin Type</Label>
              <Select value={skinType} onValueChange={setSkinType} required>
                <SelectTrigger id="skinType">
                  <SelectValue placeholder="Select your skin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="oily">Oily</SelectItem>
                  <SelectItem value="combination">Combination</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="sensitive">Sensitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Skin Concerns</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonSkinConcerns.map((concern) => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox
                      id={`concern-${concern}`}
                      checked={concerns.includes(concern)}
                      onCheckedChange={() => handleConcernToggle(concern)}
                    />
                    <Label
                      htmlFor={`concern-${concern}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {concern}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center justify-between">
                <span>Budget (Optional)</span>
              </Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger id="budget">
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget-friendly">Budget-Friendly</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="high-end">High-End</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !skinType}
            >
              {isLoading ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalRecommendations;

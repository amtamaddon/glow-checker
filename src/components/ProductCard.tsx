
import { useState } from "react";
import { Product } from "@/lib/productData";
import { cn } from "@/lib/utils";
import { Check, Droplet, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  isSelected?: boolean;
}

const ProductCard = ({ product, onClick, isSelected = false }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cleanser: "bg-cyan-100 text-cyan-800",
      toner: "bg-violet-100 text-violet-800",
      serum: "bg-amber-100 text-amber-800",
      moisturizer: "bg-green-100 text-green-800",
      sunscreen: "bg-yellow-100 text-yellow-800",
      mask: "bg-indigo-100 text-indigo-800",
      treatment: "bg-rose-100 text-rose-800",
      other: "bg-gray-100 text-gray-800"
    };
    
    return colors[category] || colors.other;
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-300",
        "glass-card hover:shadow-md",
        isSelected ? "ring-2 ring-accent ring-offset-2" : ""
      )}
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-secondary animate-pulse flex items-center justify-center">
            <Droplet className="h-8 w-8 text-muted-foreground/50 animate-bounce" />
          </div>
        )}
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 ease-out",
            "group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className={cn("text-xs font-normal", getCategoryColor(product.category))}>
              {product.category}
            </Badge>
            {product.rating && (
              <Badge variant="secondary" className="ml-2 text-xs">
                ★ {product.rating.toFixed(1)}
              </Badge>
            )}
          </div>
          
          {isSelected && (
            <div className="bg-accent rounded-full p-1">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{product.brand}</p>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {product.routines.includes("morning") && (
            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
              Morning
            </Badge>
          )}
          {product.routines.includes("evening") && (
            <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">
              Evening
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductCardDetailed = ({ product }: { product: Product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-square relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-secondary animate-pulse flex items-center justify-center">
              <Droplet className="h-10 w-10 text-muted-foreground/50 animate-bounce" />
            </div>
          )}
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className={cn(
              "w-full h-full object-cover",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <Badge className={cn(getCategoryColor(product.category))}>
              {product.category}
            </Badge>
            
            <h2 className="text-xl md:text-2xl font-semibold mt-2">{product.name}</h2>
            <p className="text-muted-foreground">{product.brand}</p>
          </div>
          
          <p className="text-sm">{product.description}</p>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Key Ingredients:</h3>
            <ul className="space-y-1">
              {product.ingredients.slice(0, 3).map((ingredient, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  {ingredient.beneficial ? (
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <span>
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-muted-foreground"> - {ingredient.purpose}</span>
                    {ingredient.concern && (
                      <span className="text-red-500 italic text-xs block">
                        Note: {ingredient.concern}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex space-x-2">
            {product.routines.includes("morning") && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Morning Routine
              </Badge>
            )}
            {product.routines.includes("evening") && (
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                Evening Routine
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    cleanser: "bg-cyan-100 text-cyan-800",
    toner: "bg-violet-100 text-violet-800",
    serum: "bg-amber-100 text-amber-800",
    moisturizer: "bg-green-100 text-green-800",
    sunscreen: "bg-yellow-100 text-yellow-800",
    mask: "bg-indigo-100 text-indigo-800",
    treatment: "bg-rose-100 text-rose-800",
    other: "bg-gray-100 text-gray-800"
  };
  
  return colors[category] || colors.other;
}


import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrapedProduct, scrapeModaOperandiProducts, convertToAppProducts } from "@/lib/scrapingService";
import { Product } from "@/lib/productData";
import { RotateCw, ShoppingBag, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ImportProductsProps {
  onImport: (products: Product[]) => void;
}

const ImportProducts = ({ onImport }: ImportProductsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [isImported, setIsImported] = useState(false);

  const handleScrape = async () => {
    setIsLoading(true);
    setProgress(10);
    setScrapedProducts([]);
    setSelectedProducts(new Set());
    setIsImported(false);
    
    try {
      toast({
        title: "Scraping products",
        description: "This may take a moment...",
      });
      
      setProgress(30);
      
      // Try to scrape products from Moda Operandi
      const products = await scrapeModaOperandiProducts();
      
      setProgress(90);
      
      if (products.length === 0) {
        // If scraping fails, use fallback data
        setScrapedProducts(getFallbackProducts());
        toast({
          title: "Using sample data",
          description: "We couldn't scrape the website, so we've loaded some example products.",
          variant: "destructive",
        });
      } else {
        setScrapedProducts(products);
        toast({
          title: "Products loaded",
          description: `Found ${products.length} products from Moda Operandi.`,
        });
      }
    } catch (error) {
      console.error("Error scraping products:", error);
      setScrapedProducts(getFallbackProducts());
      toast({
        title: "Error loading products",
        description: "We've loaded sample data instead.",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsLoading(false);
    }
  };

  const toggleProduct = (index: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedProducts(newSelected);
  };

  const selectAll = () => {
    const allIndices = new Set(scrapedProducts.map((_, i) => i));
    setSelectedProducts(allIndices);
  };

  const deselectAll = () => {
    setSelectedProducts(new Set());
  };

  const handleImport = () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product to import.",
        variant: "destructive",
      });
      return;
    }

    const selectedProductsArray = Array.from(selectedProducts).map(
      (index) => scrapedProducts[index]
    );
    
    const appProducts = convertToAppProducts(selectedProductsArray);
    onImport(appProducts);
    
    setIsImported(true);
    toast({
      title: "Products imported",
      description: `${selectedProducts.size} products have been added to your collection.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Products</CardTitle>
        <CardDescription>
          Import skincare products from Moda Operandi to analyze
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <RotateCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-center text-sm text-muted-foreground">
              Loading products, please wait...
            </p>
          </div>
        ) : scrapedProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">
                  {scrapedProducts.length} Products Available
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select the products you want to import
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-2">
              {scrapedProducts.map((product, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedProducts.has(index)
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "hover:border-muted-foreground/20"
                  }`}
                  onClick={() => toggleProduct(index)}
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-16 rounded-md bg-secondary flex-shrink-0 overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-secondary">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {product.name}
                        </h4>
                        {selectedProducts.has(index) && (
                          <Check className="h-4 w-4 text-accent flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.brand}
                      </p>
                      {product.price && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {product.price}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No Products Loaded</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to load products from Moda Operandi
            </p>
            <Button onClick={handleScrape}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Load Products
            </Button>
          </div>
        )}
      </CardContent>
      
      {scrapedProducts.length > 0 && !isImported && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={handleScrape} disabled={isLoading}>
            Refresh Products
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={selectedProducts.size === 0 || isLoading}
          >
            Import {selectedProducts.size} {selectedProducts.size === 1 ? "Product" : "Products"}
          </Button>
        </CardFooter>
      )}
      
      {isImported && (
        <CardFooter className="border-t pt-4">
          <div className="w-full text-center">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              <Check className="h-3 w-3 mr-1" />
              Products Imported Successfully
            </Badge>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Fallback products in case scraping fails
function getFallbackProducts(): ScrapedProduct[] {
  return [
    {
      name: "Vital-E Microbiome Age Defense Eye Cream",
      brand: "Peter Thomas Roth",
      imageUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&auto=format&fit=crop",
      price: "$72",
      url: "",
    },
    {
      name: "Rejuvenating Serum",
      brand: "Tata Harper",
      imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop",
      price: "$128",
      url: "",
    },
    {
      name: "Bright Reveal Peel Pads",
      brand: "Dr. Dennis Gross",
      imageUrl: "https://images.unsplash.com/photo-1608248543899-4654f007f8e9?w=500&auto=format&fit=crop",
      price: "$95",
      url: "",
    },
    {
      name: "Bamboo Enzyme Cleanser",
      brand: "KORA Organics",
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop",
      price: "$42",
      url: "",
    },
    {
      name: "Hydrating Face Mask",
      brand: "Summer Fridays",
      imageUrl: "https://images.unsplash.com/photo-1591019479725-5a7b3f736e3d?w=500&auto=format&fit=crop",
      price: "$54",
      url: "",
    },
    {
      name: "Pure Hyaluronic Acid",
      brand: "The Ordinary",
      imageUrl: "https://images.unsplash.com/photo-1608248543899-4654f007f8e9?w=500&auto=format&fit=crop",
      price: "$12",
      url: "",
    }
  ];
}

export default ImportProducts;

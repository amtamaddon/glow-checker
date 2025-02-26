import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, modaOperandiProducts, checkContraindications } from "@/lib/productData";
import Header from "@/components/Header";
import ProductCard, { ProductCardDetailed } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Droplet, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ProductInput from "@/components/ProductInput";
import IngredientAnalysis from "@/components/IngredientAnalysis";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Simple error boundary component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="text-center py-10 px-4 border border-red-200 rounded-lg">
    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
    <h3 className="font-medium mb-2">Something went wrong</h3>
    <p className="text-sm text-muted-foreground mb-4">
      We're having trouble loading this page
    </p>
    <div className="text-xs text-red-500 mb-4 max-w-xs mx-auto overflow-auto">
      {error.message}
    </div>
    <Button onClick={resetErrorBoundary}>
      <RefreshCw className="h-4 w-4 mr-2" />
      Try Again
    </Button>
  </div>
);

// Lazy load the AIAnalysis component
const AIAnalysis = lazy(() => import("@/components/AIAnalysis"));

const Analyze = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [analysisTab, setAnalysisTab] = useState("ingredients");
  const [contraindications, setContraindications] = useState<ReturnType<typeof checkContraindications> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  // Progressive loading
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (products.length === 0) {
        setIsLoading(true);
        setLoadFailed(false);
        
        try {
          // Start progress 
          setLoadProgress(10);
          
          // Step 1: Start with basic UI rendering
          await new Promise(resolve => setTimeout(resolve, 50));
          if (!mounted) return;
          setLoadProgress(30);
          
          // Step 2: Prepare initial data
          const categories: Record<string, boolean> = {};
          const initialProducts: Product[] = [];
          
          await new Promise(resolve => setTimeout(resolve, 50));
          if (!mounted) return;
          setLoadProgress(60);
          
          // Step 3: Process data in batches to prevent UI freezing
          for (let i = 0; i < modaOperandiProducts.length; i++) {
            const product = modaOperandiProducts[i];
            if (!categories[product.category]) {
              initialProducts.push({...product, id: uuidv4()});
              categories[product.category] = true;
            }
            
            // Break up processing to keep UI responsive
            if (i % 5 === 0) {
              await new Promise(resolve => setTimeout(resolve, 0));
              if (!mounted) return;
            }
          }
          
          setLoadProgress(90);
          
          if (mounted) {
            setProducts(initialProducts);
            setLoadProgress(100);
            
            // Small delay before removing loading state to ensure UI is responsive
            setTimeout(() => {
              if (mounted) {
                setIsLoading(false);
              }
            }, 100);
          }
        } catch (error) {
          console.error("Error initializing products:", error);
          if (mounted) {
            setLoadFailed(true);
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [products.length]);
  
  // Reset function for error recovery
  const handleReset = useCallback(() => {
    // Clear products state to force reinitialization
    setProducts([]);
    setSelectedProduct(null);
    setLoadFailed(false);
    setIsLoading(true);
    setLoadProgress(0);
  }, []);
  
  // Select first product when products change
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);
  
  // Check for contraindications when products change - with guard for mobile performance
  useEffect(() => {
    if (products.length >= 2) {
      // Use setTimeout to prevent UI blocking
      const timeout = setTimeout(() => {
        const result = checkContraindications(products);
        setContraindications(result);
      }, 50);
      
      return () => clearTimeout(timeout);
    } else {
      setContraindications(null);
    }
  }, [products]);
  
  const handleAddProduct = (newProduct: Omit<Product, "id">) => {
    const productWithId = {
      ...newProduct,
      id: uuidv4()
    };
    
    setProducts([...products, productWithId as Product]);
    setIsAddingProduct(false);
    setSelectedProduct(productWithId as Product);
    
    toast({
      title: "Product added",
      description: "Your product has been added to your collection"
    });
  };
  
  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(updatedProducts.length > 0 ? updatedProducts[0] : null);
    }
    
    toast({
      title: "Product removed",
      description: "The product has been removed from your collection"
    });
  };
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeTab === "all" || product.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  // Limit products displayed to improve performance
  const displayedProducts = filteredProducts.slice(0, 6); // Reduced from 10 to 6 for mobile
  
  const getModaProductsByCategory = (category: string) => {
    // Reduced from 4 to 2 for mobile performance
    return modaOperandiProducts.filter(p => p.category === category).slice(0, 2);
  };
  
  const getSuggestedProducts = () => {
    // Get one product from each category that's not already in the user's collection
    const categories: string[] = ["cleanser", "toner", "serum", "moisturizer"];
    const userProductCategories = products.map(p => p.category);
    const missingCategories = categories.filter(c => !userProductCategories.includes(c as any));
    
    let suggestions: Product[] = [];
    missingCategories.forEach(category => {
      const availableProducts = modaOperandiProducts.filter(p => p.category === category);
      if (availableProducts.length > 0) {
        suggestions.push(availableProducts[0]);
      }
    });
    
    // Reduced from 2 to 1 for mobile performance
    return suggestions.slice(0, 1);
  };
  
  // Show error fallback if loading failed
  if (loadFailed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 px-4">
          <div className="container max-w-6xl mx-auto">
            <ErrorFallback 
              error={new Error("Failed to initialize product data")} 
              resetErrorBoundary={handleReset} 
            />
          </div>
        </main>
      </div>
    );
  }
  
  // Show minimal loading UI if still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center py-10">
              <Droplet className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
              <h3 className="font-medium mb-1">Loading your products</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please wait while we prepare your skincare analysis
              </p>
              <div className="w-64 h-2 bg-secondary rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300 ease-out"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container max-w-6xl mx-auto">
          {contraindications?.hasContraindications && (
            <Alert className="mb-6 border-amber-500 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">Possible Product Contraindications</AlertTitle>
              <AlertDescription className="text-amber-700">
                {contraindications.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product List */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-medium">Your Products</h1>
                <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Add Products</DialogTitle>
                    </DialogHeader>
                    <ProductInput onAddProduct={handleAddProduct} />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="cleanser">Cleansers</TabsTrigger>
                  <TabsTrigger value="serum">Serums</TabsTrigger>
                  <TabsTrigger value="moisturizer">Moisturizers</TabsTrigger>
                </TabsList>
              </Tabs>

              {contraindications?.hasContraindications && (
                <Card className="p-4 bg-amber-50 border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                    Conflicting Products
                  </h3>
                  <div className="space-y-2">
                    {contraindications.conflictingProducts?.map((pair, i) => (
                      <div key={i} className="text-sm text-amber-700 flex items-center gap-2">
                        <div className="text-xs px-2 py-1 bg-amber-100 rounded-full">{pair[0].name}</div>
                        <X className="h-3 w-3" />
                        <div className="text-xs px-2 py-1 bg-amber-100 rounded-full">{pair[1].name}</div>
                      </div>
                    ))}
                    <p className="text-xs text-amber-600 mt-2">
                      Try using these products at different times of day or on alternating days.
                    </p>
                  </div>
                </Card>
              )}
              
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <div key={product.id}>
                      <ProductCard 
                        product={product} 
                        onClick={() => setSelectedProduct(product)}
                        isSelected={selectedProduct?.id === product.id}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 px-4 border border-dashed rounded-xl">
                    <Droplet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-medium mb-1">No products found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchTerm 
                        ? "Try a different search term" 
                        : "Add your first product to get started"}
                    </p>
                    <Button onClick={() => setIsAddingProduct(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Products
                    </Button>
                  </div>
                )}
              </div>
              
              {!isLoading && filteredProducts.length > 0 && !searchTerm && activeTab === "all" && getSuggestedProducts().length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center text-muted-foreground">
                    <Check className="h-4 w-4 mr-1 text-accent" />
                    Suggested Products
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {getSuggestedProducts().map((product, index) => (
                      <div 
                        key={index}
                        className="flex flex-col gap-1 p-2 border rounded-md hover:border-accent cursor-pointer"
                        onClick={() => {
                          handleAddProduct({
                            name: product.name,
                            brand: product.brand,
                            category: product.category,
                            imageUrl: product.imageUrl,
                            description: product.description,
                            ingredients: product.ingredients,
                            routines: product.routines,
                            rating: product.rating
                          });
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        </div>
                        <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column - Analysis */}
            <div className="lg:col-span-2">
              {selectedProduct ? (
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-medium">Product Analysis</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProduct(selectedProduct.id)}
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  
                  <ProductCardDetailed product={selectedProduct} />
                  
                  <Tabs 
                    defaultValue="ingredients" 
                    value={analysisTab}
                    onValueChange={setAnalysisTab}
                  >
                    <TabsList>
                      <TabsTrigger value="ingredients">Ingredient Analysis</TabsTrigger>
                      <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ingredients" className="mt-4">
                      <IngredientAnalysis product={selectedProduct} />
                    </TabsContent>
                    <TabsContent value="ai" className="mt-4">
                      <Suspense fallback={
                        <Card className="w-full p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-6 rounded-full" />
                              <Skeleton className="h-6 w-64" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-32 w-full" />
                          </div>
                        </Card>
                      }>
                        <AIAnalysis product={selectedProduct} />
                      </Suspense>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="h-full">
                  <div className="text-center py-10 px-4 mb-8">
                    <Droplet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-medium mb-1">No product selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a product to see detailed analysis
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {["cleanser", "moisturizer"].map(category => (
                      <div key={category}>
                        <h3 className="text-lg font-medium mb-3 capitalize">Popular {category}s</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {getModaProductsByCategory(category).map((product, index) => (
                            <div 
                              key={index}
                              className="border rounded-md p-3 hover:border-accent cursor-pointer transition-all"
                              onClick={() => {
                                handleAddProduct({
                                  name: product.name,
                                  brand: product.brand,
                                  category: product.category,
                                  imageUrl: product.imageUrl,
                                  description: product.description,
                                  ingredients: product.ingredients,
                                  routines: product.routines,
                                  rating: product.rating
                                });
                              }}
                            >
                              <div className="h-20 w-full rounded-md bg-secondary flex-shrink-0 overflow-hidden mb-2">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                  width="100"
                                  height="100"
                                  loading="lazy"
                                />
                              </div>
                              <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.brand}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyze;

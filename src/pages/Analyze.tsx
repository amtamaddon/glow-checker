
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, modaOperandiProducts, checkContraindications } from "@/lib/productData";
import Header from "@/components/Header";
import ProductCard, { ProductCardDetailed } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Droplet, AlertTriangle, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ProductInput from "@/components/ProductInput";
import IngredientAnalysis from "@/components/IngredientAnalysis";
import AIAnalysis from "@/components/AIAnalysis";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const Analyze = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [contraindications, setContraindications] = useState<ReturnType<typeof checkContraindications> | null>(null);
  
  // Fill with Moda Operandi products initially, but only 1 of each category
  useEffect(() => {
    if (products.length === 0) {
      const categories: Record<string, boolean> = {};
      const initialProducts: Product[] = [];
      
      modaOperandiProducts.forEach(product => {
        if (!categories[product.category]) {
          initialProducts.push({...product, id: uuidv4()});
          categories[product.category] = true;
        }
      });
      
      setProducts(initialProducts);
    }
  }, [products.length]);
  
  // Select first product when products change
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);
  
  // Check for contraindications when products change
  useEffect(() => {
    if (products.length >= 2) {
      const result = checkContraindications(products);
      setContraindications(result);
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
  
  const getModaProductsByCategory = (category: string) => {
    return modaOperandiProducts.filter(p => p.category === category).slice(0, 4);
  };
  
  const getSuggestedProducts = () => {
    // Get one product from each category that's not already in the user's collection
    const categories: string[] = ["cleanser", "toner", "serum", "moisturizer", "sunscreen", "mask", "treatment"];
    const userProductCategories = products.map(p => p.category);
    const missingCategories = categories.filter(c => !userProductCategories.includes(c as any));
    
    let suggestions: Product[] = [];
    missingCategories.forEach(category => {
      const availableProducts = modaOperandiProducts.filter(p => p.category === category);
      if (availableProducts.length > 0) {
        suggestions.push(availableProducts[0]);
      }
    });
    
    return suggestions;
  };
  
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
                {filteredProducts.length > 0 ? (
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <ProductCard 
                          product={product} 
                          onClick={() => setSelectedProduct(product)}
                          isSelected={selectedProduct?.id === product.id}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
              
              {filteredProducts.length > 0 && !searchTerm && activeTab === "all" && getSuggestedProducts().length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center text-muted-foreground">
                    <Check className="h-4 w-4 mr-1 text-accent" />
                    Suggested Products to Add
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getSuggestedProducts().slice(0, 2).map((product, index) => (
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
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
                  
                  <Tabs defaultValue="ingredients">
                    <TabsList>
                      <TabsTrigger value="ingredients">Ingredient Analysis</TabsTrigger>
                      <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ingredients" className="mt-4">
                      <IngredientAnalysis product={selectedProduct} />
                    </TabsContent>
                    <TabsContent value="ai" className="mt-4">
                      <AIAnalysis product={selectedProduct} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              ) : (
                <div className="h-full">
                  <div className="text-center py-10 px-4 mb-8">
                    <Droplet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4 animate-float" />
                    <h3 className="font-medium mb-1">No product selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a product to see detailed analysis
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {["cleanser", "serum", "moisturizer", "treatment"].map(category => (
                      <div key={category}>
                        <h3 className="text-lg font-medium mb-3 capitalize">Popular {category}s</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

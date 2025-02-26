
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, sampleProducts } from "@/lib/productData";
import Header from "@/components/Header";
import ProductCard, { ProductCardDetailed } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Droplet } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ProductInput from "@/components/ProductInput";
import IngredientAnalysis from "@/components/IngredientAnalysis";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Analyze = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    // If there are products but none selected, select the first one
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product List */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-medium">Your Products</h1>
                <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
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
              
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
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
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setIsAddingProduct(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                )}
              </div>
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
                  
                  <IngredientAnalysis product={selectedProduct} />
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center py-10 px-4">
                    <Droplet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4 animate-float" />
                    <h3 className="font-medium mb-1">No product selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a product to see detailed analysis
                    </p>
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

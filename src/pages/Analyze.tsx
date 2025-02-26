
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, sampleProducts } from "@/lib/productData";
import Header from "@/components/Header";
import ProductCard, { ProductCardDetailed } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Droplet, Import } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ProductInput from "@/components/ProductInput";
import IngredientAnalysis from "@/components/IngredientAnalysis";
import AIAnalysis from "@/components/AIAnalysis";
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
  
  // Add example products from the Moda Operandi list
  const addExampleProducts = () => {
    const newProducts = modaOperandiProducts.map(product => ({
      ...product,
      id: uuidv4()
    }));
    
    setProducts([...products, ...newProducts]);
    setSelectedProduct(newProducts[0]);
    
    toast({
      title: "Products added",
      description: `${newProducts.length} products have been added to your collection`
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
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Add Products</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="manual">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                        <TabsTrigger value="examples">Quick Add</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="manual">
                        <ProductInput onAddProduct={handleAddProduct} />
                      </TabsContent>
                      
                      <TabsContent value="examples">
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-2">Add Example Products</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Quickly add popular skincare products from Moda Operandi to your collection.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 mb-4">
                              {modaOperandiProducts.slice(0, 8).map((product, index) => (
                                <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                                  <div className="h-10 w-10 rounded-md bg-secondary flex-shrink-0 overflow-hidden">
                                    {product.imageUrl && (
                                      <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Button 
                              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                              onClick={() => {
                                addExampleProducts();
                                setIsAddingProduct(false);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add All Products
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
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
                    <Button onClick={() => setIsAddingProduct(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Products
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

// Adding sample products from Moda Operandi
const modaOperandiProducts: Product[] = [
  {
    id: "temp1",
    name: "InstaFacial® Collection Infusion",
    brand: "Dr. Diamond's Metacine",
    category: "treatment",
    imageUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&auto=format&fit=crop",
    description: "Premium facial infusion treatment",
    ingredients: [
      { name: "Hyaluronic Acid", purpose: "Hydration", beneficial: true },
      { name: "Peptides", purpose: "Anti-aging", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.8
  },
  {
    id: "temp2",
    name: "Restorative Lip Balm",
    brand: "Reflekt",
    category: "treatment",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop",
    description: "Nourishing and repairing lip treatment",
    ingredients: [
      { name: "Shea Butter", purpose: "Moisturizing", beneficial: true },
      { name: "Vitamin E", purpose: "Antioxidant", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.5
  },
  {
    id: "temp3",
    name: "Retinol Revolution Set",
    brand: "Skin Design London",
    category: "treatment",
    imageUrl: "https://images.unsplash.com/photo-1608248543899-4654f007f8e9?w=500&auto=format&fit=crop",
    description: "Complete retinol treatment system",
    ingredients: [
      { name: "Retinol", purpose: "Anti-aging", beneficial: true, concern: "Can cause irritation" },
      { name: "Niacinamide", purpose: "Brightening", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.7
  },
  {
    id: "temp4",
    name: "Firming Eye Treatment",
    brand: "REOME",
    category: "treatment",
    imageUrl: "https://images.unsplash.com/photo-1591019479725-5a7b3f736e3d?w=500&auto=format&fit=crop",
    description: "Targeted treatment for eye area",
    ingredients: [
      { name: "Peptides", purpose: "Firming", beneficial: true },
      { name: "Caffeine", purpose: "Reduces puffiness", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.6
  },
  {
    id: "temp5",
    name: "Mixturizer: Clear Base Moisturizer",
    brand: "Jillian Dempsey",
    category: "moisturizer",
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&auto=format&fit=crop",
    description: "Lightweight customizable moisturizer",
    ingredients: [
      { name: "Squalane", purpose: "Moisturizing", beneficial: true },
      { name: "Glycerin", purpose: "Hydrating", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.4
  },
  {
    id: "temp6",
    name: "Clean Reveal Brightening Glycolic + PHA Gel",
    brand: "epi.logic",
    category: "treatment",
    imageUrl: "https://images.unsplash.com/photo-1620655249102-de90f1f22415?w=500&auto=format&fit=crop",
    description: "Gentle exfoliating treatment gel",
    ingredients: [
      { name: "Glycolic Acid", purpose: "Exfoliating", beneficial: true, concern: "Can cause sensitivity" },
      { name: "PHAs", purpose: "Gentle exfoliation", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.3
  },
  {
    id: "temp7",
    name: "Luminous Cleansing Elixir",
    brand: "Retrouvé",
    category: "cleanser",
    imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&auto=format&fit=crop",
    description: "Luxurious cleansing treatment",
    ingredients: [
      { name: "Vitamin C", purpose: "Brightening", beneficial: true },
      { name: "Jojoba Oil", purpose: "Moisturizing", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.9
  },
  {
    id: "temp8",
    name: "Conditioning Toner with Chamomile",
    brand: "Retrouvé",
    category: "toner",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop",
    description: "Soothing and hydrating toner",
    ingredients: [
      { name: "Chamomile Extract", purpose: "Soothing", beneficial: true },
      { name: "Aloe Vera", purpose: "Calming", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.5
  },
  {
    id: "temp9",
    name: "True Calm Rosehip Gel Cleanser",
    brand: "epi.logic",
    category: "cleanser",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop",
    description: "Gentle gel cleanser for sensitive skin",
    ingredients: [
      { name: "Rosehip Oil", purpose: "Nourishing", beneficial: true },
      { name: "Calendula", purpose: "Soothing", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.7
  },
  {
    id: "temp10",
    name: "Rose Gold Illuminating Eye Masks (Set of 8)",
    brand: "111SKIN",
    category: "mask",
    imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500&auto=format&fit=crop",
    description: "Luxury eye treatment masks",
    ingredients: [
      { name: "Gold Extract", purpose: "Illuminating", beneficial: true },
      { name: "Vitamin C", purpose: "Brightening", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.8
  }
];

export default Analyze;

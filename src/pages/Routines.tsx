
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, sampleProducts, getRoutineOrder } from "@/lib/productData";
import Header from "@/components/Header";
import RoutineBuilder from "@/components/RoutineBuilder";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Droplet, ChevronRight, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ProductInput from "@/components/ProductInput";
import PersonalRecommendations from "@/components/PersonalRecommendations";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Routines = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<"morning" | "evening">("morning");
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const morningProducts = getRoutineOrder(products, "morning");
  const eveningProducts = getRoutineOrder(products, "evening");
  
  const handleAddProduct = (newProduct: Omit<Product, "id">) => {
    const productWithId = {
      ...newProduct,
      id: uuidv4()
    };
    
    setProducts([...products, productWithId as Product]);
    setIsAddingProduct(false);
    
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
    
    toast({
      title: "Products added",
      description: `${newProducts.length} products have been added to your collection`
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-medium">Your Skincare Routines</h1>
                <p className="text-muted-foreground mt-1">
                  Optimize your morning and evening skincare routines
                </p>
              </div>
              
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground sm:self-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
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
            
            <RoutineBuilder products={products} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-medium mb-6">Routine Products</h2>
                
                <Tabs defaultValue="morning" onValueChange={(v) => setSelectedRoutine(v as "morning" | "evening")}>
                  <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
                    <TabsTrigger value="morning" className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-amber-500" />
                      Morning Products
                    </TabsTrigger>
                    <TabsTrigger value="evening" className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-indigo-500" />
                      Evening Products
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="morning">
                    {morningProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {morningProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: morningProducts.length * 0.05 }}
                        >
                          <Button
                            variant="outline"
                            className="h-full w-full min-h-[200px] border-dashed flex flex-col gap-3 hover:bg-secondary/50"
                            onClick={() => setIsAddingProduct(true)}
                          >
                            <Plus className="h-6 w-6" />
                            <span>Add Product</span>
                          </Button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="text-center py-12 px-4 border border-dashed rounded-xl">
                        <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="font-medium mb-1">No morning products yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add products to your morning routine to get started
                        </p>
                        <Button onClick={() => setIsAddingProduct(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Morning Product
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="evening">
                    {eveningProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {eveningProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: eveningProducts.length * 0.05 }}
                        >
                          <Button
                            variant="outline"
                            className="h-full w-full min-h-[200px] border-dashed flex flex-col gap-3 hover:bg-secondary/50"
                            onClick={() => setIsAddingProduct(true)}
                          >
                            <Plus className="h-6 w-6" />
                            <span>Add Product</span>
                          </Button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="text-center py-12 px-4 border border-dashed rounded-xl">
                        <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="font-medium mb-1">No evening products yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add products to your evening routine to get started
                        </p>
                        <Button onClick={() => setIsAddingProduct(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Evening Product
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <PersonalRecommendations />
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

export default Routines;

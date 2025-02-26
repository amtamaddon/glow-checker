
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
                  <ProductInput onAddProduct={handleAddProduct} />
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

export default Routines;

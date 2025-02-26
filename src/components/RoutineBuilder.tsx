
import { useState, useEffect } from "react";
import { Product, getRoutineOrder } from "@/lib/productData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon, ArrowRight, MoveHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

interface RoutineBuilderProps {
  products: Product[];
}

const RoutineBuilder = ({ products }: RoutineBuilderProps) => {
  const [routineTab, setRoutineTab] = useState<"morning" | "evening">("morning");
  const [routineProducts, setRoutineProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get ordered products for the selected routine time
    const orderedProducts = getRoutineOrder(products, routineTab);
    setRoutineProducts(orderedProducts);
  }, [products, routineTab]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Your Skincare Routine</CardTitle>
        <CardDescription>
          Organize your products in the optimal order for best results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={routineTab}
          onValueChange={(value) => setRoutineTab(value as "morning" | "evening")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="morning" className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              Morning
            </TabsTrigger>
            <TabsTrigger value="evening" className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              Evening
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={routineTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="morning" className="m-0">
                <RoutineSteps products={routineProducts} time="morning" />
              </TabsContent>
              
              <TabsContent value="evening" className="m-0">
                <RoutineSteps products={routineProducts} time="evening" />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface RoutineStepsProps {
  products: Product[];
  time: "morning" | "evening";
}

const RoutineSteps = ({ products, time }: RoutineStepsProps) => {
  const timeColor = time === "morning" ? "text-amber-500" : "text-indigo-500";
  const timeBg = time === "morning" ? "bg-amber-50" : "bg-indigo-50";
  const timeBorder = time === "morning" ? "border-amber-200" : "border-indigo-200";
  
  if (products.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">
          No products added to your {time} routine yet.
        </p>
        <Button variant="link" className={timeColor}>
          Add products
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className={cn("p-3 rounded-lg", timeBg)}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={cn("font-medium", timeColor)}>
              {time === "morning" ? "Morning Routine" : "Evening Routine"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {products.length} products in optimal order
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <MoveHorizontal className="h-4 w-4" />
            <span className="sr-md:inline-block hidden">Reorder</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 relative py-2">
        <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-muted" aria-hidden="true" />
        
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-start relative z-10",
              "p-3 pl-14 rounded-lg border",
              timeBorder
            )}
          >
            <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm border">
              <span className="text-xs font-medium">{index + 1}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <Badge variant="outline" className={cn("text-xs", getCategoryColor(product.category))}>
                  {product.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-md overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

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

export default RoutineBuilder;



import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Camera, Upload, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/lib/productData";

interface ProductInputProps {
  onAddProduct: (product: Omit<Product, "id">) => void;
}

const ProductInput = ({ onAddProduct }: ProductInputProps) => {
  const { toast } = useToast();
  const [tab, setTab] = useState("manual");
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<any>("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&auto=format&fit=crop");
  const [ingredients, setIngredients] = useState("");
  const [routines, setRoutines] = useState<("morning" | "evening")[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !brand || !category) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Convert ingredients text to array of objects
    const ingredientsArray = ingredients.split(',').map(item => {
      const trimmed = item.trim();
      return {
        name: trimmed,
        purpose: "Unknown",
        beneficial: true
      };
    });
    
    const newProduct: Omit<Product, "id"> = {
      name,
      brand,
      category: category as any,
      imageUrl,
      description,
      ingredients: ingredientsArray,
      routines,
    };
    
    onAddProduct(newProduct);
    
    // Reset form
    setName("");
    setBrand("");
    setCategory("");
    setDescription("");
    setIngredients("");
    setRoutines([]);
    
    toast({
      title: "Product added",
      description: "Your product has been successfully added"
    });
  };
  
  const handleScan = () => {
    setLoading(true);
    
    // Simulate scanning process
    toast({
      title: "Scanning product...",
      description: "Please hold steady"
    });
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Product scanned",
        description: "Please review and edit the information"
      });
      
      // Simulate found data
      setName("Hydrating Facial Cleanser");
      setBrand("CeraVe");
      setCategory("cleanser");
      setDescription("Gentle, hydrating cleanser for normal to dry skin");
      setIngredients("Ceramides, Hyaluronic Acid, Glycerin");
      setRoutines(["morning", "evening"]);
    }, 2000);
  };
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Add your skincare product details to analyze ingredients and build routines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="scan">Scan Product</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="e.g. Hydrating Cleanser"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input 
                    id="brand" 
                    value={brand} 
                    onChange={e => setBrand(e.target.value)} 
                    placeholder="e.g. CeraVe"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleanser">Cleanser</SelectItem>
                      <SelectItem value="toner">Toner</SelectItem>
                      <SelectItem value="serum">Serum</SelectItem>
                      <SelectItem value="moisturizer">Moisturizer</SelectItem>
                      <SelectItem value="sunscreen">Sunscreen</SelectItem>
                      <SelectItem value="mask">Mask</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Routine</Label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={routines.includes("morning") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (routines.includes("morning")) {
                          setRoutines(routines.filter(r => r !== "morning"));
                        } else {
                          setRoutines([...routines, "morning"]);
                        }
                      }}
                      className={routines.includes("morning") 
                        ? "bg-amber-500 hover:bg-amber-600 text-white" 
                        : "border-amber-200 text-amber-700"
                      }
                    >
                      Morning
                    </Button>
                    <Button
                      type="button"
                      variant={routines.includes("evening") ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (routines.includes("evening")) {
                          setRoutines(routines.filter(r => r !== "evening"));
                        } else {
                          setRoutines([...routines, "evening"]);
                        }
                      }}
                      className={routines.includes("evening") 
                        ? "bg-indigo-500 hover:bg-indigo-600 text-white" 
                        : "border-indigo-200 text-indigo-700"
                      }
                    >
                      Evening
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Brief description of the product"
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                <Textarea 
                  id="ingredients" 
                  value={ingredients} 
                  onChange={e => setIngredients(e.target.value)} 
                  placeholder="e.g. Hyaluronic Acid, Niacinamide, Glycerin"
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="scan">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-secondary rounded-lg p-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Camera className="h-12 w-12 text-muted-foreground/70" />
                  <div>
                    <h3 className="font-medium">Scan your product</h3>
                    <p className="text-sm text-muted-foreground">Take a photo of the product or its ingredients list</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleScan}
                    disabled={loading}
                    className="bg-primary"
                  >
                    {loading ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Scan Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    or upload an image
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                type="button"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              
              {(name || brand || ingredients) && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium mb-2">Detected Information:</p>
                  <div className="space-y-2 text-sm">
                    {name && <p><span className="font-medium">Name:</span> {name}</p>}
                    {brand && <p><span className="font-medium">Brand:</span> {brand}</p>}
                    {category && <p><span className="font-medium">Category:</span> {category}</p>}
                    {ingredients && (
                      <p>
                        <span className="font-medium">Ingredients:</span>{" "}
                        <span className="text-muted-foreground">{ingredients}</span>
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e as any);
                      setTab("manual");
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add to My Products
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductInput;

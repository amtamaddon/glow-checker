import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Camera, Upload, RotateCw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, modaOperandiProducts, RoutineType } from "@/lib/productData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ProductInputProps {
  onAddProduct: (product: Omit<Product, "id">) => void;
}

const routineSteps = {
  morning: [
    { step: 1, name: "Cleanser", category: "cleanser" },
    { step: 2, name: "Toner", category: "toner" },
    { step: 3, name: "Serum", category: "serum" },
    { step: 4, name: "Moisturizer", category: "moisturizer" },
    { step: 5, name: "Sunscreen", category: "sunscreen" },
  ],
  evening: [
    { step: 1, name: "Cleanser", category: "cleanser" },
    { step: 2, name: "Toner", category: "toner" },
    { step: 3, name: "Serum", category: "serum" },
    { step: 4, name: "Treatment", category: "treatment" },
    { step: 5, name: "Moisturizer", category: "moisturizer" },
    { step: 6, name: "Mask", category: "mask" },
  ],
};

const ProductInput = ({ onAddProduct }: ProductInputProps) => {
  const { toast } = useToast();
  const [tab, setTab] = useState("examples");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineType>("morning");
  const [loading, setLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for manual entry
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    ingredients: "",
    routines: [] as RoutineType[],
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    const ingredientsArray = formData.ingredients.split(',').map(item => ({
      name: item.trim(),
      purpose: "Unknown",
      beneficial: true
    }));

    onAddProduct({
      name: formData.name,
      brand: formData.brand,
      category: formData.category as any,
      imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&auto=format&fit=crop",
      description: formData.description,
      ingredients: ingredientsArray,
      routines: formData.routines,
    });

    setFormData({
      name: "",
      brand: "",
      category: "",
      description: "",
      ingredients: "",
      routines: [],
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setLoading(true);
      toast({
        title: "Camera accessed",
        description: "Point your camera at a product label"
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access or enter details manually",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleCapture = () => {
    // In a real app, this would process the image and extract product information
    // For now, we'll simulate finding a product
    stopCamera();
    setLoading(false);
    setTab("manual");
    
    const captureRoutines: RoutineType[] = ["morning", "evening"];
    
    setFormData({
      name: "Hydrating Facial Cleanser",
      brand: "CeraVe",
      category: "cleanser",
      description: "Gentle, hydrating cleanser for normal to dry skin",
      ingredients: "Ceramides, Hyaluronic Acid, Glycerin",
      routines: captureRoutines,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would process the image and extract product information
      // For now, we'll simulate finding a product
      setTab("manual");
      
      const uploadRoutines: RoutineType[] = ["morning"];
      
      setFormData({
        name: "Uploaded Product",
        brand: "Detected Brand",
        category: "cleanser",
        description: "Details extracted from image",
        ingredients: "Detected ingredients",
        routines: uploadRoutines,
      });
    }
  };

  const filteredProducts = modaOperandiProducts.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });

  const handleProductSelect = (product: Product) => {
    const newSelected = new Set(selectedProductIds);
    if (newSelected.has(product.id)) {
      newSelected.delete(product.id);
    } else {
      newSelected.add(product.id);
    }
    setSelectedProductIds(newSelected);
  };

  const handleAddSelected = () => {
    const selectedProducts = filteredProducts.filter(p => selectedProductIds.has(p.id));
    selectedProducts.forEach(product => {
      // No need for mapping here since types now perfectly match
      onAddProduct({
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageUrl: product.imageUrl,
        description: product.description,
        ingredients: product.ingredients,
        routines: product.routines,
      });
    });
    setSelectedProductIds(new Set());
    toast({
      title: "Products added",
      description: `${selectedProducts.length} products have been added to your collection`
    });
  };

  const updateRoutines = (routine: RoutineType) => {
    const currentRoutines = formData.routines;
    if (currentRoutines.includes(routine)) {
      setFormData({
        ...formData,
        routines: currentRoutines.filter((r): r is RoutineType => r !== routine)
      });
    } else {
      setFormData({
        ...formData,
        routines: [...currentRoutines, routine]
      });
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="examples" value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="examples">Quick Add</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="scan">Scan Product</TabsTrigger>
        </TabsList>
        
        <TabsContent value="examples" className="space-y-4">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="list">Product List</TabsTrigger>
              <TabsTrigger value="routine">By Routine Step</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 gap-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={cn(
                          "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                          selectedProductIds.has(product.id) && "border-primary bg-primary/5"
                        )}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                            {product.routines.map(routine => (
                              <Badge key={routine} variant="outline" className="text-xs">
                                {routine}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProductIds(new Set(filteredProducts.map(p => p.id)))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProductIds(new Set())}
                  >
                    Clear
                  </Button>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleAddSelected}
                  disabled={selectedProductIds.size === 0}
                >
                  Add {selectedProductIds.size} {selectedProductIds.size === 1 ? "Product" : "Products"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="routine">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={selectedRoutine === "morning" ? "default" : "outline"}
                    onClick={() => setSelectedRoutine("morning")}
                  >
                    Morning Routine
                  </Button>
                  <Button
                    variant={selectedRoutine === "evening" ? "default" : "outline"}
                    onClick={() => setSelectedRoutine("evening")}
                  >
                    Evening Routine
                  </Button>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {routineSteps[selectedRoutine].map((step) => (
                      <div key={step.step} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                            {step.step}
                          </Badge>
                          <h3 className="font-medium">{step.name}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {modaOperandiProducts
                            .filter(p => p.category === step.category)
                            .slice(0, 4)
                            .map((product) => (
                              <div
                                key={product.id}
                                className={cn(
                                  "p-2 border rounded-md cursor-pointer hover:border-primary transition-all",
                                  selectedProductIds.has(product.id) && "border-primary bg-primary/5"
                                )}
                                onClick={() => handleProductSelect(product)}
                              >
                                <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button 
                  className="w-full"
                  onClick={handleAddSelected}
                  disabled={selectedProductIds.size === 0}
                >
                  Add {selectedProductIds.size} {selectedProductIds.size === 1 ? "Product" : "Products"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="manual">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanser">Cleanser</SelectItem>
                    <SelectItem value="toner">Toner</SelectItem>
                    <SelectItem value="serum">Serum</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="moisturizer">Moisturizer</SelectItem>
                    <SelectItem value="sunscreen">Sunscreen</SelectItem>
                    <SelectItem value="mask">Mask</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Routine</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.routines.includes("morning") ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateRoutines("morning")}
                  >
                    Morning
                  </Button>
                  <Button
                    type="button"
                    variant={formData.routines.includes("evening") ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateRoutines("evening")}
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">Add Product</Button>
          </form>
        </TabsContent>
        
        <TabsContent value="scan">
          <div className="space-y-4">
            {cameraStream ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleCapture}
                    disabled={loading}
                  >
                    Capture
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopCamera}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">Scan Product</h3>
                    <p className="text-sm text-muted-foreground">
                      Take a photo of the product or ingredients list
                    </p>
                    <Button
                      onClick={startCamera}
                      className="mt-2"
                    >
                      Access Camera
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            )}

            {formData.name && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Detected Information:</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {formData.name}</p>
                  <p><span className="font-medium">Brand:</span> {formData.brand}</p>
                  <p><span className="font-medium">Category:</span> {formData.category}</p>
                  <p><span className="font-medium">Description:</span> {formData.description}</p>
                  <p><span className="font-medium">Ingredients:</span> {formData.ingredients}</p>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    handleFormSubmit({ preventDefault: () => {} } as React.FormEvent);
                    setTab("examples");
                  }}
                >
                  Add to My Products
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductInput;

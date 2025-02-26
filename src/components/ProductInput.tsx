
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Camera, Upload, RotateCw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/lib/productData";
import { v4 as uuidv4 } from "uuid";

interface ProductInputProps {
  onAddProduct: (product: Omit<Product, "id">) => void;
}

const ProductInput = ({ onAddProduct }: ProductInputProps) => {
  const { toast } = useToast();
  const [tab, setTab] = useState("examples");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIndices, setSelectedProductIndices] = useState<Set<number>>(new Set());
  
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
    
    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        // We got access to the camera
        toast({
          title: "Camera access granted",
          description: "Point your camera at a product label"
        });
        
        // Just simulating scan results for now
        setTimeout(() => {
          // Release camera
          stream.getTracks().forEach(track => track.stop());
          
          setLoading(false);
          setTab("manual");
          toast({
            title: "Product detected",
            description: "We've filled in some details for you"
          });
          
          // Simulate found data
          setName("Hydrating Facial Cleanser");
          setBrand("CeraVe");
          setCategory("cleanser");
          setDescription("Gentle, hydrating cleanser for normal to dry skin");
          setIngredients("Ceramides, Hyaluronic Acid, Glycerin");
          setRoutines(["morning", "evening"]);
        }, 3000);
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setLoading(false);
        toast({
          title: "Camera access denied",
          description: "Please allow camera access or enter details manually",
          variant: "destructive"
        });
      });
  };

  const handleAddSelectedProducts = () => {
    if (selectedProductIndices.size === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product",
        variant: "destructive"
      });
      return;
    }

    const selected = Array.from(selectedProductIndices);
    selected.forEach(index => {
      const product = modaOperandiProducts[index];
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

    setSelectedProductIndices(new Set());
    
    toast({
      title: "Products added",
      description: `${selected.length} products have been added to your collection`
    });
  };

  const toggleProductSelection = (index: number) => {
    const newSelected = new Set(selectedProductIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedProductIndices(newSelected);
  };

  const filteredProducts = searchTerm 
    ? modaOperandiProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    : modaOperandiProducts;

  return (
    <div className="w-full">
      <Tabs defaultValue="examples" value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-3 mb-4 w-full">
          <TabsTrigger value="examples">Quick Add</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="scan">Scan Product</TabsTrigger>
        </TabsList>
        
        <TabsContent value="examples">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Moda Operandi products..."
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 mb-4">
              {filteredProducts.map((product, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start gap-2 p-3 border rounded-md cursor-pointer transition-all",
                    selectedProductIndices.has(index)
                      ? "border-accent bg-accent/5"
                      : "hover:border-muted-foreground/20"
                  )}
                  onClick={() => toggleProductSelection(index)}
                >
                  <div className="h-14 w-14 rounded-md bg-secondary flex-shrink-0 overflow-hidden">
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
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {product.category}
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center">
                    {selectedProductIndices.has(index) && (
                      <div className="w-3 h-3 rounded-full bg-accent" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProductIndices(new Set(filteredProducts.map((_, i) => i)))}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProductIndices(new Set())}
              >
                Clear Selection
              </Button>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-2"
              onClick={handleAddSelectedProducts}
              disabled={selectedProductIndices.size === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {selectedProductIndices.size} {selectedProductIndices.size === 1 ? "Product" : "Products"}
            </Button>
          </div>
        </TabsContent>
        
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
                      Access Camera & Scan
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
                    setTab("examples");
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
    </div>
  );
};

// Moda Operandi products with proper information
const modaOperandiProducts: Omit<Product, "id">[] = [
  {
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
  },
  {
    name: "The Rich Cream",
    brand: "Augustinus Bader",
    category: "moisturizer",
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&auto=format&fit=crop",
    description: "Luxury anti-aging face cream with TFC8 technology",
    ingredients: [
      { name: "TFC8", purpose: "Cell renewal", beneficial: true },
      { name: "Evening Primrose Oil", purpose: "Nourishing", beneficial: true },
      { name: "Vitamin E", purpose: "Antioxidant", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.9
  },
  {
    name: "The Light Moisturiser",
    brand: "MZ SKIN",
    category: "moisturizer",
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&auto=format&fit=crop",
    description: "Lightweight moisturizer for daily hydration",
    ingredients: [
      { name: "Hyaluronic Acid", purpose: "Hydration", beneficial: true },
      { name: "Vitamin C", purpose: "Brightening", beneficial: true }
    ],
    routines: ["morning"],
    rating: 4.5
  },
  {
    name: "Attar Floral Repair Concentrate",
    brand: "Monastery",
    category: "serum",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop",
    description: "Botanical repair serum with floral extracts",
    ingredients: [
      { name: "Rose Extract", purpose: "Soothing", beneficial: true },
      { name: "Botanical Oils", purpose: "Nourishing", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.6
  },
  {
    name: "Gold Restorative Face Oil",
    brand: "Monastery",
    category: "serum",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop",
    description: "Luxurious facial oil with gold-infused botanical extracts",
    ingredients: [
      { name: "Gold Extract", purpose: "Restoration", beneficial: true },
      { name: "Botanical Oils", purpose: "Nourishing", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.7
  },
  {
    name: "The Skin Infusion",
    brand: "Augustinus Bader",
    category: "toner",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop",
    description: "Essence-toner hybrid for deep hydration",
    ingredients: [
      { name: "TFC8", purpose: "Cell renewal", beneficial: true },
      { name: "Hyaluronic Acid", purpose: "Hydration", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.8
  },
  {
    name: "Red Light Face Mask",
    brand: "HigherDOSE",
    category: "mask",
    imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500&auto=format&fit=crop",
    description: "LED therapy mask for skin rejuvenation",
    ingredients: [],
    routines: ["evening"],
    rating: 4.5
  },
  {
    name: "Anti-Aging Collection",
    brand: "Dr. Lara Devgan Scientific Beauty",
    category: "treatment",
    imageUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&auto=format&fit=crop",
    description: "Complete anti-aging treatment system",
    ingredients: [
      { name: "Peptides", purpose: "Anti-aging", beneficial: true },
      { name: "Vitamin C", purpose: "Brightening", beneficial: true },
      { name: "Retinol", purpose: "Cell renewal", beneficial: true, concern: "Can cause irritation" }
    ],
    routines: ["morning", "evening"],
    rating: 4.9
  },
  {
    name: "Mineral Mask",
    brand: "Blue Lagoon Iceland",
    category: "mask",
    imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500&auto=format&fit=crop",
    description: "Purifying mineral face mask",
    ingredients: [
      { name: "Silica", purpose: "Exfoliating", beneficial: true },
      { name: "Minerals", purpose: "Purifying", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.4
  },
  {
    name: "Perfectif Night Even Skin Tone Cream",
    brand: "RéVive Skincare",
    category: "moisturizer",
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&auto=format&fit=crop",
    description: "Evening moisturizer for tone correction",
    ingredients: [
      { name: "Glycolic Acid", purpose: "Exfoliating", beneficial: true, concern: "Can cause sensitivity" },
      { name: "Vitamin C", purpose: "Brightening", beneficial: true },
      { name: "Bio-Renewal Protein", purpose: "Renewal", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.6
  },
  {
    name: "Mineral Unseen Sunscreen SPF 40",
    brand: "Supergoop!",
    category: "sunscreen",
    imageUrl: "https://images.unsplash.com/photo-1556227834-09f1de5c1856?w=500&auto=format&fit=crop",
    description: "Invisible mineral sunscreen protection",
    ingredients: [
      { name: "Zinc Oxide", purpose: "Sun protection", beneficial: true },
      { name: "Shea Butter", purpose: "Moisturizing", beneficial: true }
    ],
    routines: ["morning"],
    rating: 4.7
  },
  {
    name: "SS01 Secret Sauce Limited Edition",
    brand: "The Beauty Sandwich",
    category: "serum",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop",
    description: "Limited edition luxury facial serum",
    ingredients: [
      { name: "Proprietary Blend", purpose: "Anti-aging", beneficial: true },
      { name: "Hyaluronic Acid", purpose: "Hydration", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.9
  }
];

export default ProductInput;

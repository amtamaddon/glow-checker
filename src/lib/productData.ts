
export interface Ingredient {
  name: string;
  purpose: string;
  concern?: string;
  beneficial?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "cleanser" | "toner" | "serum" | "moisturizer" | "sunscreen" | "mask" | "treatment" | "other";
  imageUrl: string;
  description: string;
  ingredients: Ingredient[];
  routines: ("morning" | "evening")[];
  rating?: number;
}

// Mock data for initial application state
export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&auto=format&fit=crop",
    description: "Gentle, hydrating cleanser for normal to dry skin",
    ingredients: [
      { name: "Ceramides", purpose: "Restore skin barrier", beneficial: true },
      { name: "Hyaluronic Acid", purpose: "Hydration", beneficial: true },
      { name: "Glycerin", purpose: "Moisturizing", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.5
  },
  {
    id: "2",
    name: "Vitamin C Serum",
    brand: "Timeless",
    category: "serum",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop",
    description: "Brightening and anti-aging serum with 20% Vitamin C",
    ingredients: [
      { name: "Vitamin C (L-Ascorbic Acid)", purpose: "Antioxidant, brightening", beneficial: true },
      { name: "Vitamin E", purpose: "Antioxidant", beneficial: true },
      { name: "Ferulic Acid", purpose: "Enhances effectiveness of vitamins C and E", beneficial: true }
    ],
    routines: ["morning"],
    rating: 4.7
  },
  {
    id: "3",
    name: "Daily Moisturizing Lotion",
    brand: "Cetaphil",
    category: "moisturizer",
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&auto=format&fit=crop",
    description: "Lightweight moisturizer for all skin types",
    ingredients: [
      { name: "Glycerin", purpose: "Moisturizing", beneficial: true },
      { name: "Vitamin E", purpose: "Antioxidant", beneficial: true },
      { name: "Dimethicone", purpose: "Skin conditioning", beneficial: true }
    ],
    routines: ["morning", "evening"],
    rating: 4.2
  },
  {
    id: "4",
    name: "Ultra Facial Sunscreen SPF 50",
    brand: "Kiehl's",
    category: "sunscreen",
    imageUrl: "https://images.unsplash.com/photo-1556227834-09f1de5c1856?w=500&auto=format&fit=crop",
    description: "Lightweight daily sunscreen with broad spectrum protection",
    ingredients: [
      { name: "Avobenzone", purpose: "UVA protection", beneficial: true },
      { name: "Octisalate", purpose: "UVB protection", beneficial: true },
      { name: "Fragrance", purpose: "Scent", concern: "Potential irritant", beneficial: false }
    ],
    routines: ["morning"],
    rating: 4.4
  },
  {
    id: "5",
    name: "Retinol Serum",
    brand: "The Ordinary",
    category: "serum",
    imageUrl: "https://images.unsplash.com/photo-1620655249102-de90f1f22415?w=500&auto=format&fit=crop",
    description: "Anti-aging serum with 1% retinol",
    ingredients: [
      { name: "Retinol", purpose: "Anti-aging", concern: "Can cause irritation", beneficial: true },
      { name: "Squalane", purpose: "Moisturizing", beneficial: true },
      { name: "Hyaluronic Acid", purpose: "Hydration", beneficial: true }
    ],
    routines: ["evening"],
    rating: 4.6
  }
];

// Sample concerns
export const commonSkinConcerns = [
  "Acne",
  "Aging",
  "Dryness",
  "Hyperpigmentation",
  "Redness",
  "Sensitivity",
  "Texture",
  "Oiliness"
];

// Ingredient analyzer function - returns analysis based on ingredients
export const analyzeIngredients = (ingredients: Ingredient[]): {
  beneficial: Ingredient[];
  concerning: Ingredient[];
  summary: string;
} => {
  const beneficial = ingredients.filter(ing => ing.beneficial);
  const concerning = ingredients.filter(ing => ing.concern && !ing.beneficial);
  
  let summary = "";
  
  if (concerning.length === 0) {
    summary = "This product looks great for your skin! It contains beneficial ingredients without any common irritants.";
  } else if (concerning.length === 1) {
    summary = "This product is generally good but contains one potential concern.";
  } else {
    summary = `This product contains ${concerning.length} ingredients that may cause issues for some skin types.`;
  }
  
  return {
    beneficial,
    concerning,
    summary
  };
};

// Function to get recommended routine order
export const getRoutineOrder = (products: Product[], time: "morning" | "evening"): Product[] => {
  // Filter products for the specific routine time
  const routineProducts = products.filter(product => 
    product.routines.includes(time)
  );
  
  // Define the order of product categories
  const categoryOrder = {
    morning: ["cleanser", "toner", "serum", "moisturizer", "sunscreen"],
    evening: ["cleanser", "toner", "serum", "treatment", "moisturizer", "mask"]
  };
  
  // Sort products based on category order
  return routineProducts.sort((a, b) => {
    const orderA = categoryOrder[time].indexOf(a.category);
    const orderB = categoryOrder[time].indexOf(b.category);
    
    if (orderA === -1) return 1; // If category not in preferred order, put at end
    if (orderB === -1) return -1;
    
    return orderA - orderB;
  });
};

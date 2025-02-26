
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

// Moda Operandi products data for initial application state
export const modaOperandiProducts: Product[] = [
  {
    id: "moda1",
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
    id: "moda2",
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
    id: "moda3",
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
    id: "moda4",
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
    id: "moda5",
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
    id: "moda6",
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
    id: "moda7",
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
    id: "moda8",
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
    id: "moda9",
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
    id: "moda10",
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
    id: "moda11",
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
    id: "moda12",
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
    id: "moda13",
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
    id: "moda14",
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
    id: "moda15",
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
    id: "moda16",
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
    id: "moda17",
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
    id: "moda18",
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
    id: "moda19",
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
    id: "moda20",
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

// Function to check if products have any contraindications
export const checkContraindications = (products: Product[]): {
  hasContraindications: boolean;
  message: string;
  conflictingProducts?: [Product, Product][];
} => {
  const conflictingProducts: [Product, Product][] = [];
  
  // Simple check for common contraindications
  const hasRetinol = products.some(p => 
    p.ingredients.some(i => 
      i.name.toLowerCase().includes("retinol") || 
      i.name.toLowerCase().includes("retin-a") ||
      i.name.toLowerCase().includes("tretinoin")
    )
  );
  
  const hasAHA = products.some(p => 
    p.ingredients.some(i => 
      i.name.toLowerCase().includes("glycolic") || 
      i.name.toLowerCase().includes("lactic") ||
      i.name.toLowerCase().includes("aha")
    )
  );
  
  const hasBHA = products.some(p => 
    p.ingredients.some(i => 
      i.name.toLowerCase().includes("salicylic") || 
      i.name.toLowerCase().includes("bha")
    )
  );
  
  const hasVitaminC = products.some(p => 
    p.ingredients.some(i => 
      i.name.toLowerCase().includes("vitamin c") || 
      i.name.toLowerCase().includes("ascorbic") ||
      i.name.toLowerCase().includes("l-ascorbic")
    )
  );
  
  // Find the actual products with contraindications
  if (hasRetinol && hasAHA) {
    const retinolProducts = products.filter(p => 
      p.ingredients.some(i => 
        i.name.toLowerCase().includes("retinol") || 
        i.name.toLowerCase().includes("retin-a") ||
        i.name.toLowerCase().includes("tretinoin")
      )
    );
    
    const ahaProducts = products.filter(p => 
      p.ingredients.some(i => 
        i.name.toLowerCase().includes("glycolic") || 
        i.name.toLowerCase().includes("lactic") ||
        i.name.toLowerCase().includes("aha")
      )
    );
    
    retinolProducts.forEach(rp => {
      ahaProducts.forEach(ap => {
        if (
          rp.routines.some(r => ap.routines.includes(r)) && // Same routine
          rp.id !== ap.id // Not the same product
        ) {
          conflictingProducts.push([rp, ap]);
        }
      });
    });
  }
  
  if (hasRetinol && hasVitaminC) {
    const retinolProducts = products.filter(p => 
      p.ingredients.some(i => 
        i.name.toLowerCase().includes("retinol") || 
        i.name.toLowerCase().includes("retin-a") ||
        i.name.toLowerCase().includes("tretinoin")
      )
    );
    
    const vitaminCProducts = products.filter(p => 
      p.ingredients.some(i => 
        i.name.toLowerCase().includes("vitamin c") || 
        i.name.toLowerCase().includes("ascorbic") ||
        i.name.toLowerCase().includes("l-ascorbic")
      )
    );
    
    retinolProducts.forEach(rp => {
      vitaminCProducts.forEach(vp => {
        if (
          rp.routines.some(r => vp.routines.includes(r)) && // Same routine
          rp.id !== vp.id // Not the same product
        ) {
          conflictingProducts.push([rp, vp]);
        }
      });
    });
  }
  
  // Return analysis
  if (conflictingProducts.length > 0) {
    return {
      hasContraindications: true,
      message: "Some products in your routine may not work well together. Consider using them at different times.",
      conflictingProducts
    };
  }
  
  return {
    hasContraindications: false,
    message: "Your product combination looks good! No major contraindications detected."
  };
};

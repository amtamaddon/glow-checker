
import { Product } from "@/lib/productData";
import { v4 as uuidv4 } from "uuid";

export interface ScrapedProduct {
  name: string;
  brand: string;
  imageUrl: string;
  price: string;
  url: string;
}

// Function to scrape products from Moda Operandi
export async function scrapeModaOperandiProducts(): Promise<ScrapedProduct[]> {
  try {
    // Due to CORS restrictions, we'll need to use a proxy or backend service
    // For demonstration, we'll use a CORS proxy, but this is not recommended for production
    const corsProxy = "https://corsproxy.io/?";
    const url = `${corsProxy}https://www.modaoperandi.com/beauty/products/skincare`;
    
    console.log("Fetching from Moda Operandi...");
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    console.log("Received HTML, parsing...");
    
    // This is a simplified approach - actual implementation would be more robust
    // Use DOMParser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // Extract product information
    // Note: These selectors would need to be adjusted based on the actual site structure
    const productCards = Array.from(doc.querySelectorAll(".product-card"));
    
    console.log(`Found ${productCards.length} product cards`);
    
    const products: ScrapedProduct[] = [];
    
    productCards.forEach((card) => {
      try {
        const nameElement = card.querySelector(".product-name");
        const brandElement = card.querySelector(".product-brand");
        const imageElement = card.querySelector("img");
        const priceElement = card.querySelector(".product-price");
        const linkElement = card.querySelector("a");
        
        if (nameElement && brandElement && imageElement && priceElement && linkElement) {
          products.push({
            name: nameElement.textContent?.trim() || "Unknown Product",
            brand: brandElement.textContent?.trim() || "Unknown Brand",
            imageUrl: imageElement.getAttribute("src") || "",
            price: priceElement.textContent?.trim() || "",
            url: linkElement.getAttribute("href") || "",
          });
        }
      } catch (parseError) {
        console.error("Error parsing product card:", parseError);
      }
    });
    
    return products;
  } catch (error) {
    console.error("Error scraping products:", error);
    return [];
  }
}

// Convert scraped products to our app's Product format
export function convertToAppProducts(scrapedProducts: ScrapedProduct[]): Product[] {
  return scrapedProducts.map(scraped => {
    // Make a best guess at the category based on product name
    let category: "cleanser" | "toner" | "serum" | "moisturizer" | "sunscreen" | "mask" | "treatment" | "other" = "other";
    
    const name = scraped.name.toLowerCase();
    if (name.includes("cleanser") || name.includes("wash") || name.includes("cleansing")) {
      category = "cleanser";
    } else if (name.includes("toner") || name.includes("tonic") || name.includes("essence")) {
      category = "toner";
    } else if (name.includes("serum") || name.includes("concentrate")) {
      category = "serum";
    } else if (name.includes("moisturizer") || name.includes("cream") || name.includes("lotion")) {
      category = "moisturizer";
    } else if (name.includes("sunscreen") || name.includes("spf") || name.includes("uv")) {
      category = "sunscreen";
    } else if (name.includes("mask") || name.includes("masque")) {
      category = "mask";
    } else if (name.includes("treatment") || name.includes("peel") || name.includes("retinol")) {
      category = "treatment";
    }
    
    return {
      id: uuidv4(),
      name: scraped.name,
      brand: scraped.brand,
      category,
      imageUrl: scraped.imageUrl || "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500&auto=format&fit=crop",
      description: `${scraped.name} by ${scraped.brand} - Price: ${scraped.price}`,
      ingredients: [],
      routines: ["morning"], // Default routine
    };
  });
}

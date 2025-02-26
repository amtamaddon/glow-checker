
// API key should ideally be stored in a more secure way and not directly in the code
// Consider using environment variables or a backend service for production
const PERPLEXITY_API_KEY = "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";

// Cache for API responses to reduce repeated calls
const responseCache = new Map<string, string>();

interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
}

/**
 * Generate a cache key based on the input parameters
 */
const generateCacheKey = (productName: string, ingredients: string[] = []): string => {
  return `analyze_${productName}_${ingredients.join('|')}`;
};

/**
 * Analyze a skincare product and provide insights
 * Uses caching to improve performance for repeated requests
 */
export async function analyzeProduct(productName: string, ingredients: string[] = []): Promise<string> {
  try {
    const cacheKey = generateCacheKey(productName, ingredients);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey) as string;
    }
    
    const ingredientsText = ingredients.length > 0 
      ? `with these ingredients: ${ingredients.join(", ")}` 
      : "";
    
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a skincare expert who analyzes products and their ingredients. Be concise but informative."
      },
      {
        role: "user",
        content: `Analyze this skincare product: "${productName}" ${ingredientsText}. Provide a brief assessment of its likely benefits, potential concerns, and what skin types it would work best for.`
      }
    ];

    // Using AbortController to timeout long requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online", // Using the smallest model for faster responses
        messages,
        temperature: 0.2,
        max_tokens: 500, // Reduced token count for faster responses
        return_images: false,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Perplexity API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    const result = data.choices[0].message.content;
    
    // Save to cache
    responseCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error("Error analyzing product:", error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      return "The analysis request took too long. Please try again later.";
    }
    return "Unable to analyze this product at the moment. Please try again later.";
  }
}

/**
 * Generate a cache key for recommendations
 */
const generateRecommendationsCacheKey = (
  skinType: string, 
  concerns: string[], 
  budget?: string
): string => {
  return `recommendations_${skinType}_${concerns.join('|')}_${budget || 'none'}`;
};

/**
 * Get product recommendations based on skin type and concerns
 * Uses caching to improve performance for repeated requests
 */
export async function getProductRecommendations(
  skinType: string,
  concerns: string[],
  budget?: string
): Promise<string> {
  try {
    const cacheKey = generateRecommendationsCacheKey(skinType, concerns, budget);
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey) as string;
    }
    
    const concernsText = concerns.length > 0 
      ? `My main skin concerns are: ${concerns.join(", ")}.` 
      : "";
    
    const budgetText = budget 
      ? `My budget is ${budget}.` 
      : "";
    
    const messages: PerplexityMessage[] = [
      {
        role: "system",
        content: "You are a skincare expert who provides personalized product recommendations. Be concise and specific."
      },
      {
        role: "user",
        content: `Recommend skincare products for my ${skinType} skin. ${concernsText} ${budgetText} Suggest specific products for a simple routine and explain why you recommend each one.`
      }
    ];

    // Using AbortController to timeout long requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online", // Using the smallest model for faster responses
        messages,
        temperature: 0.3,
        max_tokens: 500, // Reduced token count for faster responses
        return_images: false,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Perplexity API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    const result = data.choices[0].message.content;
    
    // Save to cache
    responseCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      return "The recommendations request took too long. Please try again later.";
    }
    return "Unable to provide recommendations at the moment. Please try again later.";
  }
}

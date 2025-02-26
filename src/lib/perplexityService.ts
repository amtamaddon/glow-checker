
// API key should ideally be stored in a more secure way
const PERPLEXITY_API_KEY = "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";

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

export async function analyzeProduct(productName: string, ingredients: string[] = []): Promise<string> {
  try {
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

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages,
        temperature: 0.2,
        max_tokens: 1000,
        return_images: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Perplexity API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing product:", error);
    return "Unable to analyze this product at the moment. Please try again later.";
  }
}

export async function getProductRecommendations(
  skinType: string,
  concerns: string[],
  budget?: string
): Promise<string> {
  try {
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

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages,
        temperature: 0.3,
        max_tokens: 1000,
        return_images: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Perplexity API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return "Unable to provide recommendations at the moment. Please try again later.";
  }
}

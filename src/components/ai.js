import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a vegan recipe they could make with some or all of those ingredients. You don't have to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a webpage.`

const hf = new HfInference(import.meta.env.VITE_HF_APPI);

export default async function getRecipeFromAi(ingredients) {
  const ingredientString = ingredients.join(', ');
  try {
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [
        {role: 'system', content: SYSTEM_PROMPT},
        {role: 'user', content: `I have ${ingredientString}. Please give me a recipe I can make.`},
      ],
      max_tokens: 1024,
    });
    return response.choices[0].message.content;
  } catch(err) {
    alert(err);
  }
}

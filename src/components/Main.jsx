import { useState, useRef, useEffect } from 'react';
import getRecipeFromAi from './ai';
import Markdown from 'react-markdown';
import spinner from '../images/spinner.gif';

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [showRecipeDiv, setShowRecipeDiv] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    element && element.scrollIntoView({behavior: 'smooth', block: 'start'})
  },[recipe, showRecipeDiv]);

  function addIngredient(e) {
    e.preventDefault();
    const newIngredient = e.target[0].value;
    newIngredient && setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    e.target.reset();
  }

  function delIngredient(i) {
    setIngredients(prevIngredients => prevIngredients.filter((_, index) => index !== i));
  }

  async function callAi() {
    setRecipe(null);
    setShowRecipeDiv(true);
    const returnedRecipe = await getRecipeFromAi(ingredients);
    setRecipe(returnedRecipe)
  }

  const inputForm =
    <form onSubmit={addIngredient}>
      <input type="text" placeholder="Ingredients" />
      <button>Add ingredient</button>
    </form>

  const ingredientList = ingredients.length > 0 && 
  <section>
    <h3>Ingredients:</h3>
    <ul>
      {ingredients.map((ingredient, i) => <li key={i}><span className="text">{ingredient}</span>
        <button onClick={() => delIngredient(i)}>Del</button></li>)}
    </ul>
  </section>

  const getRecipeDiv = ingredients.length > 3 && 
  <div ref={ref} className="get-recipe-container">
    <h4>Let&apos;s go</h4>
    <button className="go-button" onClick={callAi}>Get recipe</button>
  </div>

  const recipeDiv = showRecipeDiv &&
  <div className="recipe-container">
    <h4>Chef Hugging Face Recommends</h4>
    {!recipe ? <img src={spinner} alt="Loading recipe..." /> :
    <Markdown>{recipe}</Markdown>}
  </div>

  return (
    <main>
      {inputForm}
      {ingredientList}
      {getRecipeDiv}
      {recipeDiv}
    </main>
  )
}

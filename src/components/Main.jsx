import { useState, useRef, useEffect } from 'react';
import getRecipeFromAi from './ai';
import Markdown from 'react-markdown';
import spinner from '../images/spinner.gif';

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const ref = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    element && element.scrollIntoView({behavior: 'smooth', block: 'start'})
  },[recipe]);

  function addIngredient(e) {
    e.preventDefault();
    const newIngredient = e.target[0].value;
    newIngredient && setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    e.target[0].value = '';
  }

  function delIngredient(i) {
    setIngredients(prevIngredients => prevIngredients.filter((_, index) => index !== i));
  }

  async function callAi() {
    setRecipe('spinner');
    let ingredientString = ingredients.slice(0);
     for (let i = 2; i < formRef.current.length; i++) {
       formRef.current[i].checked && ingredientString.push(formRef.current[i].value);
     }
    ingredientString = ingredientString.join(', ');
    const returnedRecipe = await getRecipeFromAi(ingredientString);
    returnedRecipe ? setRecipe(returnedRecipe) :
      setRecipe('Unable to connect');
  }

  const inputForm =
    <form onSubmit={addIngredient} ref={formRef}>
      <input type="text" placeholder="Ingredients" />
      <button>Add ingredient</button>
      <div className="break"></div>
      <label>Gluten free<input type="checkbox" name="gluten-free" value="gluten-free" /></label>
      <label>Vegan<input type="radio" name="special" value="vegan" /></label>
      <label>Vegetarian<input type="radio" name="special" value="vegetarian" /></label>
      <label>Pescatarian<input type="radio" name="special" value="pescatarian" /></label>
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

  const recipeDiv = recipe &&
  <div className="recipe-container">
    <h4>Chef Hugging Face Recommends</h4>
    {recipe === 'spinner' ? <img src={spinner} alt="Loading recipe..." /> :
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

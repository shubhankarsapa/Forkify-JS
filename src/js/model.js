// import { async } from "regenerator-runtime";
// import { search } from "core-js/fn/symbol";
import { API_URL, KEY, RESULTS_PER_PAGE } from "./config.js";
import { getJSON, sendJSON } from "./helper.js";
import recipeView from "./views/recipeView.js";

export const state = {
  recipe: {},
  search: { query: "", results: [], resultPerPage: RESULTS_PER_PAGE, page: 1 },
  bookmarks: [],
};
const createRecipeData = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingtime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    let data = await getJSON(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeData(data);
    // console.log(state.recipe);
    if (state.bookmarks.some((bookmark) => bookmark.id == id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const searchingTool = async function (query) {
  try {
    state.search.query = query;
    let result = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(result);
    const {
      data: { recipes },
    } = result;

    state.search.results = recipes.map((rep) => {
      return (rep = {
        id: rep.id,
        title: rep.title,
        publisher: rep.publisher,
        image: rep.image_url,
        ...(rep.key && { key: recipe.key }),
      });
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  let start = (page - 1) * state.search.resultPerPage;
  let end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((el) => {
    el.quantity = (el.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id == state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id == id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingred") && entry[1] != "")
      .map((el) => {
        const ingArr = el[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3) throw new Error("wrong ingredient format");
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeData(data);
    addBookmark(state.recipe);
  } catch (err) {
    console.log(err);
  }
};

// import { search } from "core-js/fn/symbol";
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
const recipeContainer = document.querySelector(".recipe");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderMarker(recipeContainer);
    //results view update selected recipe
    resultsView.update(model.getSearchResultsPage());
    //bookmarks update view seletected recipe
    bookmarksView.update(model.state.bookmarks);
    //load recipe
    await model.loadRecipe(id);

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderMarker();
    // console.log(resultsView);
    //getting query from serach bar
    const query = searchView.getQuery();
    if (!query) return;
    //storing results in state
    await model.searchingTool(query);
    //render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render intial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    resultsView.renderError(error);
  }
};
// https://forkify-api.herokuapp.com/v2

// showRecipe();

const controlBookmarks = function () {
  if (model.state.bookmarks.length) bookmarksView.render(model.state.bookmarks);
};
const controlServings = function (newServings) {
  //changing the state
  model.updateServings(newServings);
  //rending the view again
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlPagination = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};
//controller for adding a new bookmark
const controlAddBookmark = function () {
  //add remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //update book marks
  recipeView.update(model.state.recipe);

  //render bookmarks to the list
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipes = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    addRecipeView.renderMarker();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    ///closing form window
    //updatnig the bookmark view
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipes);
};
init();

// window.addEventListener("hashchange", showRecipe);
// window.addEventListener("load", showRecipe);
if (module.hot) module.hot.accept();

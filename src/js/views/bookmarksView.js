import View from "./View.js";
import icons from "url:../../img/icons.svg";
class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    // console.log(this._data);
    const markup = this._data
      .map((el) => {
        return ` <li class="preview">
    <a class="preview__link ${
      el.id == id ? "preview__link--active" : ""
    }" href="#${el.id}">
      <figure class="preview__fig">
        <img src="${el.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${el.title}</h4>
        <p class="preview__publisher">${el.publisher}</p>
        <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      </div>
    </a>
  </li>`;
      })
      .join("");
    return markup;
  }
  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
}
export default new BookmarksView();

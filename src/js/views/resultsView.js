import View from "./View.js";
import icons from "url:../../img/icons.svg";
class ResultsView extends View {
  _parentElement = document.querySelector(".results");
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
        <div class="preview__user-generated">
          
        </div>
      </div>
    </a>
  </li>`;
      })
      .join("");
    return markup;
  }
}
export default new ResultsView();

import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      const gotobtn = +btn.dataset.goto;
      // console.log(gotobtn);
      handler(gotobtn);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    //page 1 and no other
    if (this._data.page === 1 && numPages === 1) {
      return " ";
    }
    //page last
    if (this._data.page === numPages && numPages > 1) {
      return this._previousButton(this._data.page);
    }
    //page 1 and others
    if (this._data.page === 1 && numPages > 1) {
      return `${this._nextButton(this._data.page)}`;
    }
    //page others
    if (this._data.page < numPages && numPages > 1) {
      return `${this._previousButton(this._data.page)}${this._nextButton(
        this._data.page
      )}`;
    }
  }
  _previousButton(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
  `;
  }
  _nextButton(curPage) {
    return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
  }
}

export default new PaginationView();

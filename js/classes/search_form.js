export default class SearchForm {

  constructor(searchInputId, otherInputsId) {
    this.searchInputId = searchInputId;
    this.searchInput = document.getElementById(this.searchInputId);

    this.otherInputsId = otherInputsId;
    this.inputs = [];
    this.initInputs();
  }

  initInputs() {
    this.otherInputsId.forEach(id => this.inputs.push(document.getElementById(id)));
    this.inputs.push(this.searchInput);
  }

  getInputs() {
    return this.inputs;
  }

  getSearchInput() {
    return this.searchInput;
  }

  getSearchInputValue() {
    return this.searchInput.value;
  }

}
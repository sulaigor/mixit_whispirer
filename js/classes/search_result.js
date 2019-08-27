export default class SearchResult {

  constructor(searchResultId) {
    this.searchResultId = searchResultId;
    this.searchResult = document.getElementById(this.searchResultId);
  }

  initSearchResult(inputs) {
    this.searchResult.addEventListener('click', event => {
      if(event.target.classList.contains('list-item')) this.fillInputs(event.target, inputs);
    });
  }

  fillInputs(target, inputs) {
    inputs.forEach(input => {
      input.value = target.dataset[input.name];
    });
  }

  clearResults() {
    this.searchResult.innerHTML = '';
    this.hideSearchResult();
  }

  hideSearchResult() {
    this.searchResult.classList.remove('active');
  }

  showSearchResult(response) {
    this.searchResult.classList.add('active');

    if(response.length === 0) this.createListItem(null);
    else response.forEach(hit => this.createListItem(hit._source));
  }

  createListItem(source) {
    let listItem = document.createElement('li');
    listItem = this.fillListItem(listItem, source);
    this.searchResult.appendChild(listItem, true);
  }

  fillListItem(listElem, source) {
    if(source) {
      listElem.classList = 'list-item';
      listElem.setAttribute('data-street', this.getStreetName(source));
      listElem.setAttribute('data-city', source.city);
      listElem.setAttribute('data-zip', source.zip);
      listElem.appendChild(document.createTextNode(this.createItemText(source)));
    }
    else {
      listElem.appendChild(document.createTextNode('Nic nenalezeno...'));
    }
    return listElem;
  }

  getStreetName(source) {
    return `${source.street_name ? source.street_name : source.city} ${source.description_number}`;
  }

  createItemText(source) {
    return `${source.city}, ${source.street_name ? source.street_name + ' ' : ''}${source.description_number}, ${source.zip}`;
  }

}
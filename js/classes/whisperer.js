import jQuery from 'jquery';
import SearchResult from "./search_result";
import SearchForm from "./search_form";

let $ = jQuery;

export default class Whisperer {

  constructor(searchInputId, searchResultId, otherInputsId) {
    this.searchResult = new SearchResult(searchResultId);
    this.searchForm = new SearchForm(searchInputId, otherInputsId);

    this._userName = '6ce70yue9n';
    this._password = 'z7c98534dc';

    this.response = null;
    this.request = null;
    this.timer = null;

    this.initSearchInput();
    this.initAjaxLisener();

    this.searchResult.initSearchResult(this.searchForm.getInputs());
  }

  initSearchInput() {
    let time = 400;

    this.searchForm.getSearchInput().addEventListener('input', () => {
      clearTimeout(this.timer);
      this.searchResult.clearResults();
      this.searchForm.clearOtherInputs();

      this.timer = setTimeout(() => {
        if(this.searchForm.getSearchInputValue().length > 0)
          this.sendRequest({ street_name: this.searchForm.getSearchInputValue() });
      }, time);
    });
  }

  sendRequest(params, size = 20) {
    let requestUrl = `https://${this._userName}:${this._password}@address-database-9251853596.eu-central-1.bonsaisearch.net:443/addresses/_search?default_operator=AND&size=${size}&q=`;
    let header = btoa(this._userName + ":" + this._password);

    requestUrl = this.addParamsToRequestUrl(requestUrl, params);

    // console.log(requestUrl);
    // console.log(header);

    // this.request = fetch(requestUrl, {
    //   headers: new Headers({
    //     'Authorization': 'Basic ' + header,
    //     'Content-Type': 'application/json'
    //   })
    // });

    $.ajax({
      method: 'GET',
      url: requestUrl,
      dataType: 'json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + header)
      },
    });
  }

  initAjaxLisener() {
    $(document).ajaxSuccess((event, xhr, settings) => {
      this.response = JSON.parse(xhr.responseText);
      this.response = this.response.hits.hits;

      // console.log(this.response);

      this.searchResult.showSearchResult(this.response);

    });
  }

  addParamsToRequestUrl(url, params) {
    for(let param in params) url += `${param}:${params[param]}*+`;
    return url;
  }
}
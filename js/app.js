import "../scss/base.scss";
import jQuery from 'jquery';

let $ = jQuery;

let response = null;
let username = '6ce70yue9n', password = 'z7c98534dc';
let timer = null;
let time = 400;
let searchInput = document.getElementById('street-search');
let resultList = document.getElementById('search-result');

searchInput.addEventListener('click', () => {
  searchInput.placeholder = '';
});

resultList.addEventListener('click', event => {
  if(event.target.classList.contains('list-item')) {
    fillInputs(event.target);
    clearSearchList('search-result');
  }
});

searchInput.addEventListener('input', () => {
  clearSearchList('search-result');
  clearTimeout(timer);

  timer = setTimeout(() => {
    let text = searchInput.value;
    if(text.length >= 1) sendRequest({city: text});
  }, time);
});

function fillInputs(target) {
  let streetInput = document.getElementById('street-search'),
      cityInput = document.getElementById('city-search'),
      zipInpit = document.getElementById('zip-search');

  [ streetInput, cityInput, zipInpit ].forEach(input =>
    input.value = target.dataset[input.name]);
}

function clearSearchList(id) {
  let searchList = document.getElementById(id);
  searchList.classList.remove('active');
  searchList.innerHTML = '';
}

function createListItem(listElem, source) {
  let liElem = document.createElement('li');

  if(source) {
    let streetName = `${source.street_name ? source.street_name : source.city} ${source.description_number}`;
    liElem.classList = 'list-item';
    liElem.setAttribute('data-street', streetName);
    liElem.setAttribute('data-city', source.city);
    liElem.setAttribute('data-zip', source.zip);
    liElem.appendChild(document.createTextNode(createItemText(source)));
  }
  else {
    liElem.appendChild(document.createTextNode('Nic nenalezeno...'));
  }

  listElem.appendChild(liElem, true);
}

function sendRequest(params, size = 20) {
  let url = 'https://6ce70yue9n:z7c98534dc@address-database-9251853596.eu-central-1.bonsaisearch.net:443/addresses/_search?default_operator=AND&size='+ size +'&q=';

  for(let param in params) url += param +':'+ params[param] +'*+';
  // console.log(url);

  $.ajax({
    method: 'GET',
    url: url,
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password))
    },
  });
}

// $.ajax({
//   method: 'GET',
//   url: 'https://6ce70yue9n:z7c98534dc@address-database-9251853596.eu-central-1.bonsaisearch.net:443/addresses/_search?default_operator=AND&size=500&q=city:b*',
//     // '+street_name:*gaga*+',
//   dataType: 'json',
//   beforeSend: function (xhr) {
//     xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password))
//   },
// });

function createItemText(source) {
  return `${source.city}, ${source.street_name ? source.street_name + ' ' : ''}${source.description_number}, ${source.zip}`;
}

$(document).ajaxSuccess(function (event, xhr, settings) {
  response = JSON.parse(xhr.responseText);
  // console.log(response.hits.hits);

  resultList.innerHTML = '';
  if(response.hits.hits.length === 0)
    createListItem(resultList, null);
  else
    response.hits.hits.forEach(hit => {
      createListItem(resultList, hit._source);
    });

  resultList.classList.add('active');
});

$(document).ajaxError(function (event, xhr, settings) {
  console.log(xhr.responseText);
});
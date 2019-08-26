import "../scss/base.scss";
import jQuery from 'jquery';

let $ = jQuery;

let response = null;
let username = '6ce70yue9n', password = 'z7c98534dc';
let timer = null;
let time = 400;
let searchInput = document.getElementById('address-search');

searchInput.addEventListener('click', () => {
  searchInput.placeholder = '';
});

searchInput.addEventListener('input', () => {
  clearSearchList('search-result');
  clearTimeout(timer);

  timer = setTimeout(() => {
    let text = searchInput.value;
    if(text.length >= 1) sendRequest({city: text});
  }, time);
});

// let test = {
//   'city': "o",
//   'street_name': 'gaga',
// };

// sendRequest(test, 500);

function clearSearchList(id) {
  let searchList = document.getElementById(id);
  searchList.classList.remove('active');
  searchList.innerHTML = '';
}

function createListItem(listElem, text) {
  let liElem = document.createElement('li');
  liElem.classList = 'list-item';
  liElem.appendChild(document.createTextNode(text));
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

$(document).ajaxSuccess(function (event, xhr, settings) {
  response = JSON.parse(xhr.responseText);
  // console.log(response.hits.hits[299]._source);
  // console.log(response.hits.hits);
  // response.hits.hits.forEach(hit => console.log(hit._source));

  let searchList = document.getElementById('search-result');
  searchList.innerHTML = '';
  if(response.hits.hits.length == 0)
    createListItem(searchList, 'Nic nenalezeno...');
  else
    response.hits.hits.forEach(hit => {
      createListItem(searchList, hit._source.city);
    });

  searchList.classList.add('active');
});

$(document).ajaxError(function (event, xhr, settings) {
  console.log(xhr.responseText);
});
// STYLE
import '../sass/main.scss';

// CARD IMPORT
import Card from './models/card';

// ELEMENTS
const btnHome = document.querySelectorAll('.side-nav__link')[0];
const btnForm = document.querySelectorAll('.side-nav__link')[1];
const sidebar = document.querySelector('.sidebar');
const searchInput = document.querySelector('.search__input');

// CARDS
const cards = document.querySelector('.card-wrapper');
// CARDS

// modal
const modalContainer = document.querySelector('.modal-container');
const modalInner = document.querySelector('.modal__inner');
const btnModalClose = document.querySelector('.modal__close');
// modal

// Form
const form = document.querySelector('.form');
const inputTitle = document.querySelector('.form__text-input');
const inputText = document.querySelector('.form__text-area');
const inputImage = document.querySelector('.form__load-image');
// Form

// VARIABLES
const dataSource = 'https://jsonplaceholder.typicode.com/posts';

// FUNCTIONS

const clearInputs = () => {
  inputTitle.value = '';
  inputText.value = '';
  inputImage.value = '';
};

let sectionShown = 'cards';
const switchView = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // Sidebar reaction

  // To shown element
  const toShownAttr = e.currentTarget.getAttribute('data-target');

  if (sectionShown !== toShownAttr) {
    [...e.currentTarget.parentElement.parentElement.children].forEach((node) => node.classList.remove('side-nav__item--active'));
    e.currentTarget.parentElement.classList.add('side-nav__item--active');

    document.querySelector(`.${toShownAttr}`).classList.remove('d-none');
    document.querySelector(`.${sectionShown}`).classList.add('d-none');
  }
  clearInputs();
  sectionShown = toShownAttr;
};

const initCards = (data) => {
  let cardHTML = '';

  data.forEach((element) => {
    cardHTML += `<div class="card">
            <div class="card__image-box">
                <img class="card__image" alt="Card Image" src="https://picsum.photos/300/100?random=${element.image}">
            </div>
            <div class="card__block">
                <h2 class="card__title">${element.title}</h2>
                <p class="card__text">${element.body}</p>
            </div>
        </div>`;
  });

  cards.innerHTML = cardHTML;
};

const load = (url) => {
  let cardsArray = [];
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      cardsArray = data.slice(0, 10).map((x) => new Card(x.title, x.body, x.id));
      initCards(cardsArray);
    });
};

let sideBarStatus = 'closed';
const sidebarCollapse = () => {
  if (sideBarStatus === 'closed') {
    sidebar.classList.remove('sidebar--collapsed');
    sideBarStatus = 'collapsed';
  } else {
    sidebar.classList.add('sidebar--collapsed');
    sideBarStatus = 'closed';
  }
};

const displaySearchResults = (data) => {
  console.log(data.length);
  if (data.length > 0) {
    initCards(data);
  } else {
    cards.innerHTML = '<h2>Sonuç Bulunamadı<h2>';
  }
};

const search = (e, url) => {
  const val = e.target.value.trim().toLowerCase();
  if (val !== '') {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        displaySearchResults(json.filter((x) => x.title.includes(val))
          .slice(0, 10)
          .map((x) => new Card(x.title, x.body, x.id)));
      });
  }
};

const displayFormModal = (obj) => {
  if (obj) {
    modalInner.innerHTML = `<h3 class="modal__title">
           ${obj.title}
        </h3>
        <p class="modal__text">${obj.text}</p>`;
    modalContainer.style.display = 'flex';
  }
};

const submitForm = (e) => {
  e.preventDefault();
  const text = inputText.value.trim();
  const title = inputTitle.value.trim();
  if (text && title) {
    clearInputs();
    displayFormModal({
      text,
      title,
    });
  } else {
    clearInputs();
  }
};

// EVENT LISTENERS
btnForm.addEventListener('DOMContentLoaded', load(dataSource));
btnHome.addEventListener('click', switchView);
btnForm.addEventListener('click', switchView);
sidebar.addEventListener('mouseenter', sidebarCollapse);
sidebar.addEventListener('mouseleave', sidebarCollapse);
searchInput.addEventListener('keyup', (e) => {
  e.preventDefault();
  e.stopPropagation();
  search(e, dataSource);
});
form.addEventListener('submit', submitForm);
btnModalClose.addEventListener('click', () => {
  modalContainer.style.display = 'none';
});

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');
const input = form.querySelector('input[name="search-text"]');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;
let lightbox = null;

// Удаляем фокус с input при закрытии модального окна (фикс бага)
document.addEventListener('click', event => {
  if (event.target.classList.contains('sl-close') || event.target.classList.contains('sl-overlay')) {
    input.blur();
  }
});

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  query = input.value.trim();
  if (!query) {
    iziToast.info({
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits: total } = await getImagesByQuery(query, page);
    hideLoader();

    if (hits.length === 0) {
      iziToast.warning({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    totalHits = total;
    createGallery(hits);
    initLightbox(); // пересоздание lightbox

    const totalPages = Math.ceil(totalHits / perPage);
    if (totalPages > 1) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: 'The end of search results.',
        position: 'topRight',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      message: 'An error occurred while fetching data. Please try again.',
      position: 'topRight',
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const { hits } = await getImagesByQuery(query, page);
    hideLoader();
    createGallery(hits);
    initLightbox(); // пересоздание lightbox

    const totalPages = Math.ceil(totalHits / perPage);
    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    const card = document.querySelector('.gallery-item');
    if (card) {
      const { height: cardHeight } = card.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      message: 'An error occurred while fetching more data.',
      position: 'topRight',
    });
  }
});

function initLightbox() {
  if (lightbox) {
    lightbox.destroy();
  }
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    nav: true,
    loop: false,
  });
}

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
const input = document.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', async event => {
  event.preventDefault();

  query = input.value.trim();
  if (!query) {
    iziToast.warning({
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
      iziToast.error({
        message: 'No images found. Try again.',
        position: 'topRight',
      });
      return;
    }

    totalHits = total;
    createGallery(hits);
    lightbox.refresh();

    const totalPages = Math.ceil(totalHits / perPage);
    if (totalPages > 1) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: 'End of results.',
        position: 'topRight',
      });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({
      message: 'Error fetching images.',
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
    lightbox.refresh();

    const totalPages = Math.ceil(totalHits / perPage);
    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: 'No more results.',
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
      message: 'Error loading more images.',
      position: 'topRight',
    });
  }
});
document.addEventListener('click', () => {
  if (document.activeElement === input) {
    input.blur(); // снимает фокус после клика по любому месту
  }
});

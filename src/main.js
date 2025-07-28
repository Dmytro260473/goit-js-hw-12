import './css/styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

let query = '';
let page = 1;
let totalPages = 0;

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.target.elements['search-text'].value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Enter a search term', position: 'topRight' });
    return;
  }

  clearGallery();
  hideLoadMoreButton();
  page = 1;

  await loadImages();
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  await loadImages(true);
});

async function loadImages(isLoadMore = false) {
  try {
    showLoader();

    const data = await getImagesByQuery(query, page);
    totalPages = Math.ceil(data.totalHits / 15);

    if (data.hits.length === 0) {
      iziToast.info({ title: 'No Results', message: 'Try another search', position: 'topRight' });
      return;
    }

    createGallery(data.hits);

    if (page < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    if (isLoadMore) {
      scrollPage();
    }
  } catch (err) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch images', position: 'topRight' });
  } finally {
    hideLoader();
  }
}

function scrollPage() {
  const card = document.querySelector('.gallery li');
  const cardHeight = card.getBoundingClientRect().height;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

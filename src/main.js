import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from "./js/pixabay-api";
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton,
  hideLoadMoreButton, } from './js/render-functions';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    query = form.elements['search-text'].value.trim();
    if (!query) return;

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
        showLoadMoreButton();
        const totalPages = Math.ceil(totalHits / perPage);
        if (page >= totalPages) {
            hideLoadMoreButton();
            iziToast.info({
            message: "The end of search results.",
            position: 'topRight',
  });
}
    } catch (error) {   
        hideLoader();
        iziToast.error({
      message: 'We are sorry, but you have reached the end of search results.',
      position: 'topRight',
    });
    }
});

loadMoreBtn.addEventListener('click', async () => {
    page += 1;
    showLoader();
    try {
        const { hits } = await getImagesByQuery(query, page);
        createGallery(hits);
        const totalPages = Math.ceil(totalHits / perPage);
        if (page >= totalPages) {
            hideLoadMoreButton();
            iziToast.info({
            message: "We're sorry, but you've reached the end of search results.",
            position: 'topRight',
  });
}
        hideLoader();

        const { height: cardHeight } = document.querySelector('.gallery-item').getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
    } catch (error) {
        hideLoader();
    iziToast.error({
      message: 'Error',
      position: 'topRight',
    });
  }
});
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});
  
export function createGallery(images) {
  const gallery = document.querySelector('.gallery');
  const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
        <li class="gallery-item">
          <a href="${largeImageURL}" class="gallery-link">
            <img src="${webformatURL}" alt="${tags}" class="gallery-image" />
          </a>
          <div class="image-info">
            <div class="image-info-item"><span><b>Likes</b></span><span>${likes}</span></div>
            <div class="image-info-item"><span><b>Views</b></span><span>${views}</span></div>
            <div class="image-info-item"><span><b>Comments</b></span><span>${comments}</span></div>
            <div class="image-info-item"><span><b>Downloads</b></span><span>${downloads}</span></div>
          </div>
        </li>
      `;
  }).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
  
  export function clearGallery() {
  document.querySelector('.gallery').innerHTML = '';
}

const loadMoreBtn = document.querySelector('.load-more');
const loaderWrapper = document.querySelector('.loader-wrapper');

export function showLoader() {
  loaderWrapper.classList.remove('is-hidden');
}

export function hideLoader() {
  loaderWrapper.classList.add('is-hidden');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}
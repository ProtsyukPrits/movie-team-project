import * as basicLightbox from 'basiclightbox';
import spinner from '../images/header/sprite.svg#icon-spinner';

const loading = basicLightbox.create(
    `<div class="loading">
        <h2 class="loading__title">Loading ... </h2>
        <img class="loading__icon" src="${spinner}"/>
    </div>`
);

export default loading;
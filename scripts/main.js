let currentMovie = 0;
let movies;

const previousMovie = document.querySelector('#prev');
const nextMovie = document.querySelector('#next');
const form = document.querySelector('form');
const inputMovieNumber = form.querySelector('input[type=number]');
const movieOfMovies = form.querySelector('p');
const submitMovieNumber = form.querySelector('input[type=submit]');
const loading = document.querySelector('#loading');

previousMovie.addEventListener('click', () => {
    currentMovie--;
    updateMovieDetails();
});

nextMovie.addEventListener('click', () => {
    currentMovie++;
    updateMovieDetails();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    currentMovie = inputMovieNumber.value - 1;
    updateMovieDetails();
});

inputMovieNumber.value = 0;

const div = document.querySelector('.movie');
const movieTitle = div.querySelector('h2');
const releasedDate = div.querySelector('p');
const castHeader = div.querySelector('h3');
const castMembers = div.querySelector('ul');

fetch('https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json').then(response => {  
    console.log(`Response status ${response.status}`);

    if (response.status !== 200) {
        loading.textContent = 'Error loading movies.';
    }

    return response.json();
}).then(json => {
    movies = json;

    console.log(`Found ${movies.length} movies`);
    if (movies.length > 0) {
        inputMovieNumber.disabled = false;
        submitMovieNumber.disabled = false;

        movieOfMovies.textContent = `of ${movies.length}`;

        inputMovieNumber.min = 1;
        inputMovieNumber.max = movies.length;

        updateMovieDetails();

        document.body.removeChild(loading);
    } else {
        loading.textContent = 'No movies found';
    }
});

function updateMovieDetails() {
    // Disable previous button if viewing first movie.
    previousMovie.disabled = (currentMovie === 0);

    // Disable next button if viewing last movie.
    nextMovie.disabled = (currentMovie === (movies.length - 1)); 

    const movie = movies.at(currentMovie);
    movieTitle.textContent = movie.title;
    releasedDate.textContent = `Released in ${movie.year}.`;

    while (castMembers.firstChild) {
        castMembers.removeChild(castMembers.firstChild);
    }

    if (movie.cast.length > 0) {
        castHeader.textContent = 'Cast members:'
    } else {
        castHeader.textContent = 'Couldn\'t find any cast members';
    }

    movie.cast.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member
        castMembers.appendChild(li);
    });

    inputMovieNumber.value = currentMovie + 1;
    console.log(`Showing movie ${currentMovie} of ${movies.length - 1}`);
}
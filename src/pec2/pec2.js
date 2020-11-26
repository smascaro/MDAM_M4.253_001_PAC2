import * as fetch from "node-fetch";

/* #region Endpoint values */
const endpoint = "https://swapi.dev/api/";
const filmsResource = "films";
const films = `${endpoint}${filmsResource}`;
/* #endregion */

function getMovieCount() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      resolve(json.count);
    } else {
      rejectWithHttpError(reject, filmsResource, response);
    }
  });
}

function listMovies() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      let movies = json.results.map(mapResponseToFilmCallback);
      resolve(movies);
    } else {
      rejectWithHttpError(reject, filmsResource, response);
    }
  });
}

function listMoviesSorted() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      let sortedMovies = json.results
        .map(mapResponseToFilmCallback)
        .sort(compareByTitleCallback);
      resolve(sortedMovies);
    } else {
      rejectWithHttpError(reject, filmsResource, response);
    }
  });
}

function listEvenMoviesSorted() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      let sortedMovies = json.results
        .map(mapResponseToFilmCallback)
        .sort(compareByEpisodeIdCallback);
      resolve(sortedMovies);
    } else {
      rejectWithHttpError(reject, films, response);
    }
  });
}

function getMovieInfo(id) {
  return new Promise(async (resolve, reject) => {
    if (isNaN(id)) {
      reject("Not a valid id");
      return null;
    }
    let response = await fetch(`${films}/${id}`);
    if (response.ok) {
      let json = await response.json();
      let movieInfo = mapResponseToMovieInfo(json);
      resolve(movieInfo);
    } else {
      rejectWithHttpError(reject, films, response);
    }
  });
}

function getCharacterName(url) {
  return getAttributeFromUrl(url, "name");
}

function getMovieCharacters(id) {
  return new Promise(async (resolve, reject) => {
    if (isNaN(id)) {
      reject("Invalid id");
      return;
    }
    let info = await getMovieInfo(id);
    let characterNames = await Promise.all(
      info.characters.map(async (characterUrl) => {
        return await getCharacterName(characterUrl);
      })
    );
    info.characters = characterNames;
    resolve(info);
  });
}

async function getPlanetNameFromCharacter(characterUrl) {
  let planetUrl = await getAttributeFromUrl(characterUrl, "homeworld");
  return getPlanetName(planetUrl);
}

function getPlanetName(url) {
  return getAttributeFromUrl(url, "name");
}

//Reuse this function to avoid code duplication all over codebase
function getAttributeFromUrl(url, attribute) {
  return new Promise(async (resolve, reject) => {
    if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
      reject("URL is not valid");
      return;
    }
    url = url.replace("http://", "https://");
    let response = await fetch(url);
    if (response.ok) {
      let json = await response.json();
      resolve(json[attribute]);
    } else {
      rejectWithHttpError(reject, films, response);
    }
  });
}

function getMovieCharactersAndHomeworlds(id) {
  return new Promise(async (resolve, reject) => {
    if (isNaN(id)) {
      reject(`Invalid id, ${id} must be a number`);
      return;
    }
    let movieInfo = await getMovieInfo(id);
    let characters = await Promise.all(
      movieInfo.characters.map(async (characterUrl) => {
        let name = await getCharacterName(characterUrl);
        let homeworld = await getPlanetNameFromCharacter(characterUrl);
        return new MovieCharacter(name, homeworld);
      })
    );
    movieInfo.characters = characters;
    resolve(movieInfo);
  });
}

async function createMovie(id) {
  const movie = await getMovieInfo(id);
  return new Movie(movie.name, movie.characters);
}

async function createMovieExercise8(id) {
  // We catch the rejected promise so the error is not propagated to the client.
  // In case of error, null is returned so the client handles it as an error.
  const movie = await getMovieInfo(id).catch((error) => {
    console.error(error);
    return null;
  });
  return movie;
}
/* #region Helpers & Callbacks */

const mapResponseToMovieInfo = (result) =>
  new MovieInfo(result.title, result.episode_id, result.characters);

const mapResponseToFilmCallback = (result) =>
  new Film(
    result.title,
    result.director,
    result.release_date,
    result.episode_id
  );

const compareByTitleCallback = (first, second) => {
  if (first.name < second.name) return -1;
  if (first.name > second.name) return 1;
  return 0;
};

const compareByEpisodeIdCallback = (first, second) => {
  if (first.episodeID < second.episodeID) return -1;
  if (first.episodeID > second.episodeID) return 1;
  return 0;
};
/* #endregion */
/* #region Common */

function rejectWithHttpError(reject, resource, response) {
  reject(reason(resource, response));
}

function reason(resource, response) {
  return `Call to endpoint '${resource}' returned status code ${response.status}`;
}
/* #endregion */
/* #region Models */
class Film {
  name = "";
  director = "";
  release = "";
  episodeID = 0;
  constructor(filmName, filmDirector, filmReleaseDate, filmEpisodeId) {
    this.name = filmName;
    this.director = filmDirector;
    this.release = filmReleaseDate;
    this.episodeID = filmEpisodeId;
  }
}

class MovieInfo {
  name = "";
  episodeID = 0;
  characters = [];
  constructor(movieName, movieEpisodeId, movieCharacters) {
    this.name = movieName;
    this.episodeID = movieEpisodeId;
    this.characters = movieCharacters;
  }
}

class MovieCharacter {
  name = "";
  homeworld = "";
  constructor(characterName, characterHomeworld) {
    this.name = characterName;
    this.homeworld = characterHomeworld;
  }
}

//Exercise 7
class Movie {
  name = "";
  characters = [];
  constructor(movieName, movieCharactersUrls) {
    this.name = movieName;
    this.characters = movieCharactersUrls;
  }
  getCharacters = () => {
    return new Promise(async (resolve, reject) => {
      let charactersNames = await Promise.all(
        this.characters.map(async (item) => {
          const characterName = await getCharacterName(item);
          return characterName;
        })
      );
      resolve(charactersNames);
    });
  };
  getHomeworlds = () => {
    return new Promise(async (resolve, reject) => {
      let planets = await Promise.all(
        this.characters.map(async (item) => {
          let characterPlanet = await getPlanetNameFromCharacter(item);
          return characterPlanet;
        })
      );
      resolve(planets);
    });
  };
  #compareByTitleReverseCallback = (first, second) => {
    if (first < second) return 1;
    if (first > second) return -1;
    return 0;
  };
  getHomeworldsReverse = () => {
    return new Promise(async (resolve, reject) => {
      let homeworlds = await this.getHomeworlds();
      homeworlds.sort(this.#compareByTitleReverseCallback);
      resolve(homeworlds);
    });
  };
}
/* #endregion */

export default {
  getMovieCount,
  listMovies,
  listMoviesSorted,
  listEvenMoviesSorted,
  getMovieInfo,
  getCharacterName,
  getMovieCharacters,
  getMovieCharactersAndHomeworlds,
  createMovie,
  createMovieExercise8, //Exported for local tests
  Movie,
};

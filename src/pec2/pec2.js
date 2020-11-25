import * as fetch from "node-fetch";
import { Film, MovieCharacter, MovieInfo } from "./model";

const endpoint = "https://swapi.dev/api/";
const filmsResource = "films";
const films = `${endpoint}${filmsResource}`;
const peopleResource = "people";
const people = `${endpoint}${peopleResource}`;
export function getMovieCount() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      resolve(json.count);
    } else {
      reject(reason(filmsResource, response));
    }
  });
}

export function listMovies() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      let movies = json.results.map(mapResponseToFilm);
      resolve(movies);
    } else {
      reject(reason(filmsResource, response));
    }
  });
}

export function listMoviesSorted() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      let sortedMovies = json.results
        .map(mapResponseToFilm)
        .sort(compareByTitle);
      resolve(sortedMovies);
    } else {
      reject(reason(filmsResource, response));
    }
  });
}
export function listEvenMoviesSorted() {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(films);
    if (response.ok) {
      let json = await response.json();
      let sortedMovies = json.results
        .map(mapResponseToFilm)
        .sort(compareByEpisodeId);
      resolve(sortedMovies);
    } else {
      rejectWithHttpError(reject, films, response);
    }
  });
}

const mapResponseToFilm = (result) =>
  new Film(
    result.title,
    result.director,
    result.release_date,
    result.episode_id
  );

const compareByTitle = (first, second) => {
  if (first.name < second.name) return -1;
  if (first.name > second.name) return 1;
  return 0;
};

const compareByEpisodeId = (first, second) => {
  if (first.episodeID < second.episodeID) return -1;
  if (first.episodeID > second.episodeID) return 1;
  return 0;
};

export function getMovieInfo(id) {
  if (isNaN(id)) return new MovieInfo();
  return new Promise(async (resolve, reject) => {
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

const mapResponseToMovieInfo = (result) =>
  new MovieInfo(result.title, result.episode_id, result.characters);

export function getCharacterName(url) {
  return getAttributeFromUrl(url, "name");
}

export function getMovieCharacters(id) {
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

export async function getPlanetNameFromCharacter(characterUrl) {
  let planetUrl = await getAttributeFromUrl(characterUrl, "homeworld");
  return getPlanetName(planetUrl);
}
export function getPlanetName(url) {
  return getAttributeFromUrl(url, "name");
}
export function getMovieCharactersAndHomeworlds(id) {
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

export function getCharacterInfoByName(name) {
  return new Promise(async (resolve, reject) => {
    let response = await fetch(`${people}?search=${name}`);
    if (response.ok) {
      let json = await response.json();
      console.log(json);
      if (json.count == 0) {
        reject(`No character found with name matching pattern ${name}`);
      } else if (json.count > 1) {
        reject(
          `Too many characters found with name matching pattern ${name}. Name should be unique`
        );
      } else {
        resolve(json.results[0]);
      }
    } else {
      rejectWithHttpError(reject, people, response);
    }
  });
}
function rejectWithHttpError(reject, resource, response) {
  reject(reason(resource, response));
}
function reason(resource, response) {
  return `Call to endpoint '${resource}' returned status code ${response.status}`;
}

export default {
  getMovieCount,
  listMovies,
  listMoviesSorted,
  listEvenMoviesSorted,
  getMovieInfo,
  getCharacterName,
  getMovieCharacters,
  getMovieCharactersAndHomeworlds,
  getPlanetNameFromCharacter,
};

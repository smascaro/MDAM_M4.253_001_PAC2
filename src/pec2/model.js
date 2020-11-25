import { getCharacterName, getPlanetNameFromCharacter } from "./pec2";

export class Film {
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

export class MovieInfo {
  name = "";
  episodeID = 0;
  characters = [];
  constructor(movieName, movieEpisodeId, movieCharacters) {
    this.name = movieName;
    this.episodeID = movieEpisodeId;
    this.characters = movieCharacters;
  }
}

export class MovieCharacter {
  name = "";
  homeworld = "";
  constructor(characterName, characterHomeworld) {
    this.name = characterName;
    this.homeworld = characterHomeworld;
  }
}

//Exercise 7
export class Movie {
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
          return await getCharacterName(item);
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
  #compareByTitleReverse = (first, second) => {
    if (first < second) return 1;
    if (first > second) return -1;
    return 0;
  };
  getHomeworldsReverse = async () => {
    let homeworlds = await this.getHomeworlds();
    homeworlds.sort(this.#compareByTitleReverse);
    return homeworlds;
  };
}
export default { Film, MovieInfo, MovieCharacter };

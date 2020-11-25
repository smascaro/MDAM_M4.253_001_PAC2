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

export default { Film, MovieInfo };

/**
 * To implement this PEC2 TDD practices have been used.
 * This file contains all tests used to get error-proof implementations.
 * These are divided by Exercise as "described" sections.
 * At the moment of the delivery, all 38 tests passes in a total of 31.028s (due to all network calls).
 * Note: The timeout needed to be extended (--testTimeout=90000 although a lower value would suffice).
 */
import PEC2 from "./pec2";
import testdata from "./test-data";

describe("PEC2 Tests", () => {
  describe("Exercici 1 - Movies count", () => {
    test("getMovieCount", async () => {
      let movieCount = await PEC2.getMovieCount();
      expect(movieCount).toEqual(6);
    });
  });
  describe("Exercici 2 - List movies", () => {
    test("listMovies - returns array", async () => {
      let movies = await PEC2.listMovies();
      expect(Array.isArray(movies)).toBe(true);
    });
    test("listMovies - returned array is not empty", async () => {
      let movies = await PEC2.listMovies();
      expect(movies.length).toBeGreaterThan(0);
    });
    test("listMovies - array returns valid data", async () => {
      let movies = await PEC2.listMovies();
      movies.forEach((value) => {
        expect(value.name.length).not.toEqual(0);
        expect(value.director.length).not.toEqual(0);
        expect(value.release.length).not.toEqual(0);
        expect(value.episodeID).not.toEqual(0);
      });
    });
  });

  describe("Exercici 3 - List movies sorted", () => {
    test("listMoviesSorted - returns array", async () => {
      let sortedMovies = await PEC2.listMoviesSorted();
      expect(Array.isArray(sortedMovies)).toBe(true);
    });
    test("listMoviesSorted - returned array is not empty", async () => {
      let sortedMovies = await PEC2.listMoviesSorted();
      expect(sortedMovies.length).toBeGreaterThan(0);
    });
    test("listMoviesSorted - returned array is sorted by title", async () => {
      let sortedMovies = await PEC2.listMoviesSorted();
      let titles = sortedMovies.map((item) => item.name);
      let sortedTitles = Array.from(titles).sort();
      expect(titles).toEqual(sortedTitles);
    });
  });

  describe("Exercici 4 - List even movies sorted", () => {
    test("listEvenMoviesSorted - returns array", async () => {
      let sortedMovies = await PEC2.listEvenMoviesSorted();
      expect(Array.isArray(sortedMovies)).toBe(true);
    });
    test("listEvenMoviesSorted - returned array is not empty", async () => {
      let sortedMovies = await PEC2.listEvenMoviesSorted();
      expect(sortedMovies.length).toBeGreaterThan(0);
    });
    test("listEvenMoviesSorted - returned array episode ids are correct type: number", async () => {
      let sortedMovies = await PEC2.listEvenMoviesSorted();
      sortedMovies.forEach((val) => expect(val.episodeID).not.toBeNaN());
    });
    test("listEvenMoviesSorted - returned array is sorted by episode", async () => {
      let sortedMovies = await PEC2.listEvenMoviesSorted();
      let episodes = sortedMovies.map((item) => item.episodeID);
      let sortedEpisodes = Array.from(episodes).sort();
      expect(episodes).toEqual(sortedEpisodes);
    });
    test("listEvenMoviesSorted - returned array's first movie is episode 1", async () => {
      let sortedMovies = await PEC2.listEvenMoviesSorted();
      expect(sortedMovies[0].episodeID).toEqual(1);
    });
  });

  describe("Exercici 5", () => {
    describe("Exercici 5.1 - Get movie info", () => {
      test("getMovieInfo - returns null object when id is not valid", async () => {
        expect(async () => {
          let movieInfo = await PEC2.getMovieInfo("INVALID_PARAM");
        }).rejects.not.toBeUndefined();
      });
      test("getMovieInfo - returns only one object", async () => {
        let movieInfo = await PEC2.getMovieInfo(1);
        expect(typeof movieInfo).toBe("object");
      });
      test("getMovieInfo - returns object of type MovieInfo (has MovieInfo properties)", async () => {
        let movieInfo = await PEC2.getMovieInfo(1);
        expect(typeof movieInfo).toBe("object");
        expect(Array.isArray(movieInfo.characters)).toBe(true);
        expect(typeof movieInfo.name).toBe("string");
        expect(movieInfo.episodeID).not.toBeNaN();
      });
    });

    describe("Exercici 5.2 - Get character name", () => {
      test("getCharacterName - returns null when url is not valid (malformed)", async () => {
        expect(async () => {
          let characterName = await PEC2.getCharacterName(
            "THIS_IS_NOT_A_VALID_URL"
          );
        }).rejects.not.toBeUndefined();
      });
      test("getCharacterName - fails when url is not valid (wrong endpoint/API)", async () => {
        const url = "http://swapi.dev/api/THIS_IS_NOT_PART_OF_THE_API/1/";
        expect(async () => {
          let nameFromApi = await PEC2.getCharacterName(url);
        }).rejects.not.toBeUndefined();
      });
      test("getCharacterName - returns string data", async () => {
        const url = "http://swapi.dev/api/people/1/"; //Luke Skywalker
        let nameFromApi = await PEC2.getCharacterName(url);
        expect(typeof nameFromApi).toBe("string");
      });
      test("getCharacterName - returns valid data", async () => {
        const url = "http://swapi.dev/api/people/1/"; //Luke Skywalker
        const expectedName = "Luke Skywalker";
        let nameFromApi = await PEC2.getCharacterName(url);
        expect(nameFromApi).toEqual(expectedName);
      });
    });

    describe("Exercici 5.3 - Get movie characters", () => {
      test("getMovieCharacters - rejected if id is not valid", async () => {
        expect(async () => {
          const movieInfo = await PEC2.getMovieCharacters("INVALID_FILM_ID");
        }).rejects.not.toBeUndefined();
      });
      test("getMovieCharacters - returned data is valid", async () => {
        const movieInfo = await PEC2.getMovieCharacters(1);
        expect(typeof movieInfo).toBe("object");
        expect(typeof movieInfo.name).toBe("string");
        expect(movieInfo.name).not.toBe("");
        expect(Array.isArray(movieInfo.characters)).toBe(true);
        expect(movieInfo.characters.length).toBeGreaterThan(0);
        expect(movieInfo.episodeID).not.toBeNaN();
      });
      test("getMovieCharacters - returned data contains valid characters", async () => {
        const movieInfo = await PEC2.getMovieCharacters(1);
        expect(movieInfo.characters).toEqual(
          expect.arrayContaining(["Luke Skywalker", "R2-D2"])
        );
      });
      test("getMovieCharacters - returned data does not contain invalid character", async () => {
        const movieInfo = await PEC2.getMovieCharacters(1);
        expect(movieInfo.characters).not.toEqual(
          expect.arrayContaining(["Doctor Who"])
        );
      });
    });
  });

  describe("Exercici 6 - Get movie characters and home worlds", () => {
    test("getMovieCharactersAndHomeworlds - rejects if id is not valid", () => {
      expect(async () => {
        let info = await PEC2.getMovieCharactersAndHomeworlds(
          "INVALID_FILM_ID"
        );
      }).rejects.not.toBeUndefined();
    });
    test("getMovieCharactersAndHomeworlds - returned data is valid", async () => {
      let info = await PEC2.getMovieCharactersAndHomeworlds(1);
      expect(typeof info).toBe("object");
      expect(typeof info.name).toBe("string");
      expect(info.name).not.toBe("");
      expect(info.episodeID).not.toBeNaN();
      expect(Array.isArray(info.characters)).toBe(true);
      expect(info.characters.length).toBeGreaterThan(0);
    });
    test("getMovieCharactersAndHomeworlds - returned characters data is valid", async () => {
      let info = await PEC2.getMovieCharactersAndHomeworlds(1);
      info.characters.forEach((item) => {
        expect(typeof item).toBe("object");
        expect(typeof item.name).toBe("string");
        expect(item.name).not.toBe("");
        expect(typeof item.homeworld).toBe("string");
        expect(item.homeworld).not.toBe("");
      });
    });
    test("getMovieCharactersAndHomeworlds - returned characters data is coherent", async () => {
      let info = await PEC2.getMovieCharactersAndHomeworlds(1);
      expect(info.characters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Luke Skywalker",
            homeworld: "Tatooine",
          }),
        ])
      );
    });
  });

  describe("Exercici 7 - Create movie", () => {
    test("getHomeworlds - returned array is valid", async () => {
      let movie = new PEC2.Movie("A New Hope", testdata.charactersUrls);
      let homeworlds = await movie.getHomeworlds();
      expect(homeworlds.length).not.toEqual(0);
      expect(homeworlds.length).toEqual(movie.characters.length);
    });
    test("getHomeworlds - returned array is empty if there are no characters in the movie", async () => {
      let movie = new PEC2.Movie("A New Hope", []);
      let homeworlds = await movie.getHomeworlds();
      expect(homeworlds.length).toEqual(0);
      expect(homeworlds.length).toEqual(movie.characters.length);
    });
    test("getCharacters - returned array is valid", async () => {
      let movie = new PEC2.Movie("A New Hope", testdata.charactersUrls);
      let characters = await movie.getCharacters();
      expect(characters.length).not.toEqual(0);
      expect(characters.length).toEqual(movie.characters.length);
      expect(characters).toEqual(expect.arrayContaining(["Luke Skywalker"]));
    });
    test("getCharacters - returned array is empty if there are no characters in the movie", async () => {
      let movie = new PEC2.Movie("A New Hope", []);
      let characters = await movie.getCharacters();
      expect(characters.length).toEqual(0);
      expect(characters.length).toEqual(movie.characters.length);
    });
    test("getHomeworldsReverse - returned array is empty if there are no characters in the movie", async () => {
      let movie = new PEC2.Movie("A New Hope", []);
      let characters = await movie.getHomeworldsReverse();
      expect(characters.length).toEqual(0);
      expect(characters.length).toEqual(movie.characters.length);
    });
    test("getHomeworldsReverse - returned array is valid", async () => {
      let movie = new PEC2.Movie("A New Hope", testdata.charactersUrls);
      let characters = await movie.getHomeworldsReverse();
      expect(characters.length).not.toEqual(0);
      expect(characters.length).toEqual(movie.characters.length);
      expect(characters).toEqual(expect.arrayContaining(["Tatooine"]));
    });
    test("getHomeworldsReverse - returned array is alphabetically inverse sorted", async () => {
      let movie = new PEC2.Movie("A New Hope", testdata.charactersUrls);
      let homeworlds = await movie.getHomeworldsReverse();
      let homeworldsReversed = Array.from(homeworlds).sort().reverse();
      expect(homeworldsReversed).toEqual(homeworlds);
    });
    test("getHomeworldsReverse - returned array is empty if there are no characters in the movie", async () => {
      let movie = new PEC2.Movie("A New Hope", []);
      let homeworlds = await movie.getHomeworldsReverse();
      expect(homeworlds.length).toEqual(0);
      expect(homeworlds.length).toEqual(movie.characters.length);
    });
    test("createMovie - returned object has movie attributes", async () => {
      const movie = await PEC2.createMovie(5);
      expect(typeof movie.name).toBe("string");
      expect(movie.name).not.toEqual("");
      const homeworlds = await movie.getHomeworlds();
      expect(Array.isArray(homeworlds)).toBe(true);
      expect(homeworlds.length).toBeGreaterThan(0);
      const homeworldsReverse = await movie.getHomeworldsReverse();
      expect(Array.isArray(homeworldsReverse)).toEqual(true);
      expect(homeworldsReverse.length).toBeGreaterThan(0);
      const characters = await movie.getCharacters();
      expect(Array.isArray(characters)).toEqual(true);
      expect(characters.length).toBeGreaterThan(0);
    });
    test("createMovie - returned object is null when id is not valid", async () => {
      expect(async () => {
        const movieInvalidId = await PEC2.createMovie("INVALID_ID");
      }).rejects.not.toBeUndefined();
      expect(async () => {
        const movieNoId = await PEC2.createMovie();
      }).rejects.not.toBeUndefined();
    });
  });

  describe("Exercise 8 - Handle errors", () => {
    test("createMovieExercise8 - returns null when id is not valid", async () => {
      const movie = await PEC2.createMovieExercise8();
      expect(movie).toBe(null);
    });
  });
});

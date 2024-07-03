import { useEffect, useState } from "react";
import { Box } from "./Box";
import { Loader } from "./Loader";
import { Main } from "./Main";
import { MovieDetails } from "./MovieDetails";
import { MovieList } from "./MovieList";
import { Navbar } from "./Navbar";
import { NotifyMessage } from "./NotifyMessage";
import { NumResults } from "./NumResults";
import { Search } from "./Search";
import { WatchedMovieList } from "./WatchedMovieList";
import { WatchedSummary } from "./WatchedSummary";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export const KEY = "ba57a252";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }

  function handleCloseMovieDetails() {
    setSelectedID(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsloading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );

        if (!res.ok) {
          throw new Error("Something Went Wrong when fetching the data");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Result not found");
        }

        setMovies(data.Search);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsloading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();
  }, [query]);

  return (
    <>
      <Navbar>
        <Search search={query} onSearch={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {!query && !error && (
            <NotifyMessage message={"Please search your movie"}>
              <span>🔍</span>
            </NotifyMessage>
          )}
          {isLoading && <Loader />}
          {!error && !isLoading && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
          )}
          {error && (
            <NotifyMessage message={error}>
              <span>⛔</span>
            </NotifyMessage>
          )}
        </Box>
        <Box>
          {" "}
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              watched={watched}
              onCloseMovieDetails={handleCloseMovieDetails}
              onHandleAddWatchedMovie={handleAddWatchedMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

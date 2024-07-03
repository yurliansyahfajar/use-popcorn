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
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsloading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Something Went Wrong when fetching the data");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Result not found");
        }

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(error.message);
          setError(error.message);
        }
      } finally {
        setIsloading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    handleCloseMovieDetails();
    fetchMovies();

    return function () {
      controller.abort();
    };
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

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
import { useMovies } from "./useMovies";

export const KEY = "ba57a252";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const { movies, isLoading, error } = useMovies(
    query,
    handleCloseMovieDetails
  );

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
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

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

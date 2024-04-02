import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../lib/firebase";

const Search = () => {

  // Search a movie
  const [searchMovies, setSearchMovies] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "movies")),
      (snapshot) => {
        const moviesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSearchMovies(moviesData);
      }
    );

    return unsubscribe;
  }, []);

  const searchMovie = (event) => {
    const result = searchMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchVal.toLowerCase())
    );
    if (event.key == "Enter") {
      setResults(result);
    }
  };

  return (
    <Container>
      <h4>Search Here</h4>
      <SearchBar
        type="text"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        onKeyDown={searchMovie}
      />
      <Content>
        {results.map((movie, key) => (
          <Wrap key={key}>
            {movie.id}
            <Link
              to={
                movie.type === "series"
                  ? "/series/" + movie.id
                  : "/movies/detail/" + movie.id
              }
            >
              <img src={movie.cardImg} alt={movie.title} />
            </Link>
          </Wrap>
        ))}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 0 26px;
  margin: 100px 100px;

  @media (max-width: 768px) {
    margin: 100px 50px;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 650px;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 20px;
  margin-bottom: 50px;
`;

const Content = styled.div`
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Wrap = styled.div`
  padding-top: 56.25%;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  border: 3px solid rgba(249, 249, 249, 0.1);

  img {
    inset: 0px;
    display: block;
    height: 100%;
    object-fit: cover;
    opacity: 1;
    position: absolute;
    transition: opacity 500ms ease-in-out 0s;
    width: 100%;
    z-index: 1;
    top: 0;
  }

  &:hover {
    box-shadow: rgb(0 0 0 / 80%) 0px 40px 58px -16px,
      rgb(0 0 0 / 72%) 0px 30px 22px -10px;
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);
  }
`;

export default Search;

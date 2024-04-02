import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../lib/firebase";
import styled from "styled-components";
import { useEffect } from "react";
import { FaPlus, FaCheck } from "react-icons/fa";
import { selectUID } from "../features/user/userSlice";
import { useSelector } from "react-redux";

const Episodes = () => {

  // Accessing ID from the param
  const params = useParams();
  const { id } = params;
  
  // Accessing all episodes associated to content ID
  const [episodes, setEpisodes] = useState([]);

  // Conditional check - If content is added to watchlist or not
  const [watchlistIcon, setWatchlistIcon] = useState(false);

  // Accessing user creds
  const user = useSelector(selectUID);

  useEffect(() => {
    const fetchData = async () => {

      // Get the EPISODES collection 
      const unsubscribe = onSnapshot(
        query(collection(doc(db, "movies", id), "episodes"), orderBy("episodeNumber", "asc")),
        (snapshot) => {
          const moviesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEpisodes(moviesData);
        }
      );

      // Check if added to watchlist
      const watchlistDoc = await getDoc(
        doc(db, "users", user, "watchlist", id)
      );
      if (watchlistDoc.exists()) {
        setWatchlistIcon(true);
      }

      return unsubscribe;
    };

    fetchData();
  }, [id, user]);

  // Add to watchlist method
  const addToWatchList = async () => {
    if (!watchlistIcon) {
      setWatchlistIcon(true);
      const movieDoc = await getDoc(doc(db, "movies", id));
      console.log(movieDoc);
      if (movieDoc.exists()) {
        await setDoc(doc(collection(db, "users", user, "watchlist"), id), {
          id: movieDoc.id,
          ...movieDoc.data(),
        });
      }
    } else {
      setWatchlistIcon(false);
      await deleteDoc(doc(db, "users", user, "watchlist", id));
    }
  };

  return (
    <Container>
      <Box>
        <h4>Episodes</h4>
        <AddList onClick={addToWatchList}>
          {!watchlistIcon ? (
            <FaPlus style={{ color: "white", fontSize: "18px" }} />
          ) : (
            <FaCheck style={{ color: "white", fontSize: "18px" }} />
          )}
        </AddList>
      </Box>
      <Content>
        {episodes.map((episode, key) => (
          <Wrap key={key}>
            <Link to={`/series/detail/${id}/${episode.id}`}>
              <img src={episode.cardImg} alt={episode.title} />
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

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const AddList = styled.button`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;

  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
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

export default Episodes;

import React, { useEffect } from 'react';
import styled from 'styled-components';
import ImgSlider from '../components/ImgSlider';
import Recommends from '../components/Recommends';
import WatchList from '../components/WatchList';
import NewReleases from '../components/NewReleases';
import WatchSeries from '../components/WatchSeries';
import { movies } from '../lib/movies';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Home = () => {

  const episodes = [
    {
      "episodeNumber": "1",
      "title": "EP1: Soul",
      "description": "When the kingdom's most wanted bandit is taken hostage by Rapunzel — a teen with 70 feet of golden hair who's looking to escape the tower where she's been locked away for years — the unlikely duo sets off on a hair-raising escapade.",
      "duration": "2010 | 1h 40m |",
      "backgroundImg": "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/FA1548A6B82C9991B1D38DF251A388FEA2483904510FBC73E150F67F7BDE38C0/scale?width=1440&aspectRatio=1.78&format=jpeg",
      "cardImg": "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/0ECD36DD35658155915685271440833C29ED87E788CF8AE111AA6BCA6B939C37/scale?width=400&aspectRatio=1.78&format=jpeg",
      "movieURL": "https://firebasestorage.googleapis.com/v0/b/video-streaming-app-59520.appspot.com/o/movies%2Fraya.mp4?alt=media&token=42e252f8-e979-42d3-b289-1d3ddee877f1"
    },
    {
        "episodeNumber": "2",
        "title": "EP2: Soul",
        "description": "When the kingdom's most wanted bandit is taken hostage by Rapunzel — a teen with 70 feet of golden hair who's looking to escape the tower where she's been locked away for years — the unlikely duo sets off on a hair-raising escapade.",
        "duration": "2010 | 1h 40m |",
        "backgroundImg": "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/FA1548A6B82C9991B1D38DF251A388FEA2483904510FBC73E150F67F7BDE38C0/scale?width=1440&aspectRatio=1.78&format=jpeg",
        "cardImg": "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/0ECD36DD35658155915685271440833C29ED87E788CF8AE111AA6BCA6B939C37/scale?width=400&aspectRatio=1.78&format=jpeg",
        "movieURL": "https://firebasestorage.googleapis.com/v0/b/video-streaming-app-59520.appspot.com/o/movies%2Fraya.mp4?alt=media&token=42e252f8-e979-42d3-b289-1d3ddee877f1"
    },
    {
        "episodeNumber": "3",
        "title": "EP3: Soul",
        "description": "When the kingdom's most wanted bandit is taken hostage by Rapunzel — a teen with 70 feet of golden hair who's looking to escape the tower where she's been locked away for years — the unlikely duo sets off on a hair-raising escapade.",
        "duration": "2010 | 1h 40m |",
        "backgroundImg": "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/FA1548A6B82C9991B1D38DF251A388FEA2483904510FBC73E150F67F7BDE38C0/scale?width=1440&aspectRatio=1.78&format=jpeg",
        "cardImg": "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/0ECD36DD35658155915685271440833C29ED87E788CF8AE111AA6BCA6B939C37/scale?width=400&aspectRatio=1.78&format=jpeg",
        "movieURL": "https://firebasestorage.googleapis.com/v0/b/video-streaming-app-59520.appspot.com/o/movies%2Fraya.mp4?alt=media&token=42e252f8-e979-42d3-b289-1d3ddee877f1"
    },
  ];

  useEffect(() => {
    const pushData = async () => {
      try {
        const seriesQuerySnapshot = await getDocs(query(collection(db, "movies"), where("type", "==", "series")));
        seriesQuerySnapshot.forEach(async (doc) => {
          const seriesRef = doc.ref;
          const episodesCollectionRef = collection(seriesRef, "episodes");

          for(const episode of episodes) {
            await addDoc(episodesCollectionRef, episode);
            console.log("Episode added successfully");
          }
        });
      } catch(err) {
        console.error("Error", err);
      }
    }

    const pushMovies = async () => {
      try {
        for(const movie of movies) {
          let uploadDoc = {
            ...movie,
            releaseDate: serverTimestamp()
          }
          await addDoc(collection(db, "movies"), uploadDoc);
          console.log("Added");
        }
      } catch(err) {
        console.error("Error", err);
      }
    }

    // pushMovies();

    // pushData();
  }, []);

  return (
    <Container>
      <ImgSlider />
      <NewReleases />
      <Recommends />
      <WatchSeries />
      <WatchList />
    </Container>
  )
}

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url("/images/home-background.png") center center / cover;
    no-repeat fixed;
    content: "";
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;

export default Home;
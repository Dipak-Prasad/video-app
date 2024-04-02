import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../lib/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import Popup from "reactjs-popup";
import { FaArrowCircleLeft } from "react-icons/fa";
import ShakaPlayer from 'shaka-player-react';
import 'shaka-player-react/dist/controls.css';
import { FaPlus, FaShare, FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUID } from "../features/user/userSlice";

const Detail = () => {
  
  // Accessing ID from the param
  const { id } = useParams();

  // Accessing the content meta data associated with ID
  const [detailData, setDetailData] = useState({});

  // Conditional check - If content is added to watchlist or not
  const [watchlistIcon, setWatchlistIcon] = useState(false);

  // Accessing user creds
  const user = useSelector(selectUID);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching that content doc associated with the ID
        const movieDoc = await getDoc(doc(db, "movies", id));
        if (movieDoc.exists()) {
          setDetailData({ id: movieDoc.id, ...movieDoc.data() });
        } else {
          console.log("No such document exists");
        }
  
        // Checking if added to watchlist or not
        const watchlistDoc = await getDoc(doc(db, "users", user, "watchlist", detailData.id));
        if (watchlistDoc.exists()) {
          setWatchlistIcon(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id, user, detailData.id]);

  // Share content on social media method
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: window.location.href
        });
        console.log("URL shared successfully");
      } catch (error) {
        console.error("Error sharing URL:", error);
      }
    } else {
      console.log("Web Share API not supported");
    }
  }

  // Add to watchlist method
  const addToWatchList = async () => {
    if(!watchlistIcon) {
      setWatchlistIcon(true);
      await setDoc(doc(collection(db, "users", user, "watchlist"), detailData.id), detailData);
    } else {
      setWatchlistIcon(false);
      await deleteDoc(doc(db, "users", user, "watchlist", detailData.id));
    }
  }

  return (
    <Container>
      <Background>
        <img alt={detailData.title} src={detailData.backgroundImg} />
      </Background>

      <ImageTitle>
        <img alt={detailData.title} src={detailData.titleImg} />
      </ImageTitle>
      <ContentMeta>
        <Controls>
          <Popup
            trigger={
              <Player>
                <img src="/images/play-icon-black.png" alt="" />
                <span>Play</span>
              </Player>
            }
            open={true}
            modal
            nested
          >
            {
              (close) => (
                <Modal>
                  <MenuBar>
                    <CloseBtn onClick={() => close()}>
                      <FaArrowCircleLeft />
                    </CloseBtn>
                    <Description>{detailData.title}</Description>
                  </MenuBar>
                  {/* <ShakaPlayer autoPlay src={detailData.movieURL} /> */}
                  <Video controls={true} autoPlay={true} controlsList="nodownload">
                    <source src={detailData.movieURL} />
                  </Video>
                  <Box>
                    <QualitySwitch >
                      1080p
                    </QualitySwitch>
                    <QualitySwitch>
                      720p
                    </QualitySwitch>
                    <QualitySwitch>
                      480p
                    </QualitySwitch>
                    <QualitySwitch>
                      360p
                    </QualitySwitch>
                  </Box>
                </Modal>
              )
            }
          </Popup>
          <Popup
            trigger={
              <Trailer>
                <img src="/images/play-icon-white.png" alt="" />
                <span>Trailer</span>
              </Trailer>
            }
            modal
            nested
          >
            {
              (close) => (
                <Modal>
                  <MenuBar>
                    <CloseBtn onClick={() => close()}>
                      <FaArrowCircleLeft />
                    </CloseBtn>
                    <Description>{detailData.title} - Trailer</Description>
                  </MenuBar>
                  <Video controls={true} autoPlay controlsList="nodownload">
                    <source src={detailData.trailerURL} type="video/mp4" />
                  </Video>
                </Modal>
              )
            }
          </Popup>
          <AddList onClick={addToWatchList}>
            {!watchlistIcon ? (<FaPlus style={{ color: 'white', fontSize: '18px' }} />) : (<FaCheck style={{ color: 'white', fontSize: '18px' }} />)}
          </AddList>
          <GroupWatch onClick={handleShare}>
            <div>
              <FaShare />
            </div>
          </GroupWatch>
        </Controls>
        <SubTitle>{detailData.subTitle}</SubTitle>
        <Description>{detailData.description}</Description>
      </ContentMeta>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-height: calc(100vh-250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const Box = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 20px 0;
`;

const QualitySwitch = styled.button`
  color: #f9f9f9;
  font-weight: bold;
  background-color: #0063e5;
  border-radius: 4px;
  border: 1px solid transparent;
  outline: none;
  padding: 2px 10px;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;

const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100vw;
    height: 100vh;

    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 600px;
    min-width: 200px;
    width: 35vw;
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  background: rgb (249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);

  img {
    width: 32px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 25px;
    }
  }
`;

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const Modal = styled.div`
  width: 700px;
  background: url("/images/home-background.png") center center / cover;
  border-radius: 12px;
  border: 2px solid rgb(249, 249, 249);
  margin: auto;
  margin-top: 30px;
  padding: 10px;

  @media (max-width: 768px) {
    width: auto;
    margin: auto 13px;
  }
`;

const MenuBar = styled.div`
  width: 100%;
  padding: 4px 12px;
  border-bottom: 2px solid rgb(249, 249, 249);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  color: rgb(249, 249, 249);
  font-size: 22px;
`;

const Video = styled.video`
  width: 100%;
  margin-top: 10px;
  border-radius: 6px;
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

const GroupWatch = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;
    display: grid;
    place-items: center;

    svg {
      width: 100%;
      font-size: 18px;
    }
  }
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export default Detail;
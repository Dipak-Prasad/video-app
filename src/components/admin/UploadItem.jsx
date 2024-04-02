import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { db, storage } from "../../lib/firebase";
import Popup from "reactjs-popup";
import { FaArrowCircleLeft } from "react-icons/fa";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import EpisodeItem from "./EpisodeItem";
import Loader from "./Loader";

const UploadItem = ({ movie, setContent }) => {

  // Stores all episodes in subcollection - FOR SERIES ONLY
  const [episodes, setEpisodes] = useState([]);

  const [load, setLoad] = useState(false);
  const [episodeLoad, setEpisodeLoad] = useState(false);

  const closeRef = useRef(null);

  // Updates EPISODES state if new docs added to DB - FOR SERIES ONLY
  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentSnapshot = await getDocs(
          query(collection(db, "movies", movie.id, "episodes"), orderBy("episodeNumber", "asc"))
        );
        const contentData = contentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEpisodes(contentData.reverse());
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [movie.id]);

  // Doc format for updating MOVIES and SERIES meta data
  const [updateContentData, setUpdateContentData] = useState({
    title: movie.title,
    subTitle: movie.subTitle,
    description: movie.description,
    cardImg: movie.cardImg,
    backgroundImg: movie.backgroundImg,
    titleImg: movie.titleImg,
  });

  // Doc format for updating MOVIES and SERIES file data
  const [contentFileInput, setContentFileInput] = useState({
    cardImg: null,
    backgroundImg: null,
    titleImg: null,
  });

  // onChange handler - updateContentData
  const handleContentDataChange = (event) => {
    setUpdateContentData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  // onChange handler - contentFileInput
  const handleFileChange = (event) => {
    setContentFileInput((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.files[0],
    }));
  };

  // Update Content Method
  let uploadTasks = [];
  const updateContent = async (event) => {
    event.preventDefault();
    try {
      setLoad(true);
      // Uploading new file data to storage bucket - BACKGROUND.IMG, CARD.IMG, TITLE.IMG
      uploadTasks = Object.keys(contentFileInput).map(async (key) => {
        const file = contentFileInput[key];
        if (file) {
          const storageRef = ref(
            storage,
            `movies/${updateContentData.title}/${key}`
          );
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          updateContentData[key] = downloadURL;
        }
      });

      await Promise.all(uploadTasks);

      // Setting up updated doc
      const updatedDoc = {
        ...updateContentData,
      };

      // Updating the doc in backend
      const docRef = await updateDoc(doc(db, "movies", movie.id), updatedDoc);
      if(docRef) {
        setLoad(false);
      }

      // Condition for SERIES UPDATE - EPISODE content
      if (movie.type === "series") {
        // Uploading new episode to backend
        const newEpisodes = episodes.filter((episode) => !episode.id);

        await Promise.all(
          newEpisodes.map(async (episode) => {
            episode.cardImg = updateContentData.cardImg;
            episode.backgroundImg = updateContentData.backgroundImg;
            episode.titleImg = updateContentData.titleImg;
            await addDoc(
              collection(doc(db, "movies", movie.id), "episodes"),
              episode
            );
          })
        );
      }

      setLoad(false);
      closeRef.current.click();
      alert("Content Updated successfully!");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Method for deleting MOVIE or SERIES
  const deleteContent = async (id) => {
    const confirmation = confirm("Are you sure you want to delete this?");
    if (confirmation) {
      await deleteDoc(doc(db, "movies", id));
      const storageRef =  ref(storage, `movies/${movie.title}`);
      const folderContents = await listAll(storageRef);
      await Promise.all(folderContents.items.map(async (item) => {
        await deleteObject(item);
      }));
      setContent((prevContent) => prevContent.filter((item) => item.id !== id));
    }
  };

  // UPDATE - Adding new episode to SERIES
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [episodeFile, setEpisodeFile] = useState(null);

  const handleAddEpisode = async (event) => {
    event.preventDefault();
    try {
      setEpisodeLoad(true);
      // Uploading new episode file to storage bucket
      if (episodeFile) {
        const storageRef = ref(
          storage,
          `movies/${updateContentData.title}/episodes/${episodeNumber}.mp4`
        );
        await uploadBytes(storageRef, episodeFile);
        const episodeDownloadURL = await getDownloadURL(storageRef);
        if(episodeDownloadURL) {
          setEpisodeLoad(false);
        }

        // New episode meta data doc
        const updatedEpisodeUploadData = {
          episodeNumber: episodeNumber,
          title: `EP${episodeNumber}: ${updateContentData.title}`,
          subTitle: updateContentData.subTitle,
          description: updateContentData.description,
          cardImg: updateContentData.cardImg,
          backgroundImg: updateContentData.backgroundImg,
          titleImg: updateContentData.titleImg,
          episodeURL: episodeDownloadURL,
        };

        // Updating episodes array in frontend
        setEpisodes((prevEpisodes) => [
          ...prevEpisodes,
          updatedEpisodeUploadData,
        ]);

        setEpisodeNumber('');
        setEpisodeFile(null);
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  return (
    <Box>
      <Text>{movie.title}</Text>
      <TypeText>{movie.type}</TypeText>
      <Div>
        <Popup
          trigger={<ViewDetails>Edit</ViewDetails>}
          closeOnDocumentClick={false}
          closeOnEscape={false}
          modal
          nested
        >
          {(close) => (
            <Modal>
              <MenuBar>
                <CloseBtn
                  onClick={() => {
                    close();
                  }}
                  ref={closeRef}
                >
                  <FaArrowCircleLeft />
                </CloseBtn>
                <Description>Edit Content</Description>
              </MenuBar>
              {
                load ? (
                  <Loader />
                ) : (
                  <UploadForm onSubmit={updateContent} method="post">
                    <InputGroup>
                      <Label>Title</Label>
                      <Input
                        name="title"
                        value={updateContentData.title}
                        onChange={handleContentDataChange}
                        type="text"
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Sub Title</Label>
                      <Input
                        name="subTitle"
                        value={updateContentData.subTitle}
                        onChange={handleContentDataChange}
                        type="text"
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Description</Label>
                      <Textarea
                        name="description"
                        onChange={handleContentDataChange}
                        value={updateContentData.description}
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Card Image</Label>
                      <FileInput
                        name="cardImg"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Background Image</Label>
                      <FileInput
                        name="backgroundImg"
                        onChange={handleFileChange}
                        type="file"
                        accept="image/*"
                      />
                    </InputGroup>
                    <InputGroup>
                      <Label>Title Image</Label>
                      <FileInput
                        name="titleImg"
                        onChange={handleFileChange}
                        type="file"
                        accept="image/*"
                      />
                    </InputGroup>
                    {movie.type === "series" && (
                      <>
                        {episodes.map((episode, i) => (
                          <EpisodeItem
                            movie={movie}
                            episode={episode}
                            setEpisodes={setEpisodes}
                            key={i}
                          />
                        ))}
                        <EpisodeBox>
                          {
                            episodeLoad ? (
                              <Loader />
                            ) : (
                              <>
                              <Heading>Add Episodes</Heading>
                              <InputGroup>
                                <Label>Episode No.</Label>
                                <Input
                                  name="episodeNumber"
                                  onChange={(e) => setEpisodeNumber(e.target.value)}
                                  value={episodeNumber}
                                  type="text"
                                  placeholder="Eg: 1"
                                />
                              </InputGroup>
                              <InputGroup>
                                <Label>Upload Episode</Label>
                                <FileInput
                                  name="episodeFiles"
                                  onChange={(e) => setEpisodeFile(e.target.files[0])}
                                  type="file"
                                  accept="video/*"
                                />
                              </InputGroup>
                              <SubmitButton onClick={handleAddEpisode}>
                                Add Episode
                              </SubmitButton>
                              </>
                            )
                          }
                        </EpisodeBox>
                      </>
                    )}
                    <Delete onClick={() => close()}>Cancel</Delete>
                    <SubmitButton type="submit">Update Changes</SubmitButton>
                  </UploadForm>
                )
              }
            </Modal>
          )}
        </Popup>
        <Delete onClick={() => deleteContent(movie.id)}>Delete</Delete>
      </Div>
    </Box>
  );
};

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border: 2px solid #090b13;
  padding: 0 20px;
`;

const EpisodeBox = styled.div`
  padding: 20px 30px;
  border: 2px solid white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Div = styled.div`
  display: flex;
  gap: 10px;
`;

const ViewDetails = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  font-size: 14px;
  padding: 7px 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;

const Delete = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #d11a2a;
  font-size: 14px;
  padding: 7px 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Text = styled.h2`
  color: #090b13;
  font-size: 16px;
  width: 30%;
`;

const TypeText = styled.h2`
  color: #090b13;
  font-size: 16px;
`;

const Modal = styled.div`
  width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  background: url("/images/home-background.png") center center / cover;
  border-radius: 12px;
  border: 2px solid rgb(249, 249, 249);
  margin: auto;
  margin-top: 30px;
  padding: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    width: auto;
    margin: auto 13px;
  }
`;

const MenuBar = styled.div`
  width: 100%;
  padding: 4px 12px;
  border-bottom: 2px solid #f9f9f9;
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: #f9f9f9;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  color: rgb(249, 249, 249);
  font-size: 22px;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #f9f9f9;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
`;

const FileInput = styled.input`
  padding: 10px;
  border: none;
  outline: none;
`;

const Heading = styled.h3`
  color: white;
  font-size: 20px;
  text-align: center;
`;

const SubmitButton = styled.button`
  background-color: #0063e5;
  color: #f9f9f9;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0483ee;
  }
`;

export default UploadItem;

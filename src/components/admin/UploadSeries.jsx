import React, { useState } from "react";
import styled from "styled-components";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import Loader from "./Loader";

const UploadSeries = ({ closeRef }) => {

    const [episodes, setEpisodes] = useState([]);

    const [load, setLoad] = useState(false);
    const [episodeLoad, setEpisodeLoad]= useState(false);

    const [contentUploadData, setContentUploadData] = useState({
        title: '',
        subTitle: '',
        description: '',
        type: 'series',
    });

    const [contentFileInput, setContentFileInput] = useState({
        cardImg: null,
        backgroundImg: null,
        titleImg: null,
        trailerURL: null
    });

    const handleInputChange = (e) => {
        setContentUploadData({
        ...contentUploadData,
        [e.target.name]: e.target.value,
        });
    };

    const handleFileInputChange = (e) => {
        setContentFileInput({
        ...contentFileInput,
        [e.target.name]: e.target.files[0],
        });
    };

    const [episodeNumber, setEpisodeNumber] = useState('');
    const [episodeFile, setEpisodeFile] = useState(null);

    const handleUpload = async (event) => {
        event.preventDefault();
        try {
            setLoad(true);
        const uploadTasks = Object.keys(contentFileInput).map(async (key) => {
            const file = contentFileInput[key];
            if(file) {
                const storageRef = ref(storage, `movies/${contentUploadData.title}/${key}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                contentUploadData[key] = downloadURL;
            }
        });

        await Promise.all(uploadTasks);

        const docData = {
            ...contentUploadData,
            releaseDate: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, 'movies'), docData);
        
        await Promise.all(episodes.map(async (episode) => {
            episode.cardImg = contentUploadData.cardImg;
            episode.backgroundImg = contentUploadData.backgroundImg;
            episode.titleImg = contentUploadData.titleImg;
            episode.trailerURL = contentUploadData.trailerURL;
            await addDoc(collection(docRef, 'episodes'), episode);
            setLoad(false);
        }));

        closeRef.current.click();

        alert('Content uploaded successfully');

        setContentUploadData({
            title: '',
            subTitle: '',
            description: '',
            type: 'series',
        });
        
        setContentFileInput({
            cardImg: null,
            backgroundImg: null,
            titleImg: null,
            trailerURL: null
        });

        } catch (error) {
        console.error('Error submitting form:', error);
        }
    };

    const handleAddEpisode = async (event) => {
        event.preventDefault();
        try {
            setEpisodeLoad(true);
            if (episodeFile) {
                const storageRef = ref(storage, `movies/${contentUploadData.title}/episodes/${episodeNumber}.mp4`);
                await uploadBytes(storageRef, episodeFile);
                const episodeDownloadURL = await getDownloadURL(storageRef);
                if(episodeDownloadURL) {
                    setEpisodeLoad(false);
                }
            
                const updatedEpisodeUploadData = {
                    episodeNumber: episodeNumber,
                    title: `EP${episodeNumber}: ${contentUploadData.title}`,
                    subTitle: contentUploadData.subTitle,
                    description: contentUploadData.description,
                    cardImg: contentUploadData.cardImg,
                    backgroundImg: contentUploadData.backgroundImg,
                    titleImg: contentUploadData.titleImg,
                    episodeURL: episodeDownloadURL,
                    trailerURL: contentUploadData.trailerURL
                };

                setEpisodeNumber('');
                setEpisodeFile(null);
        
                setEpisodes(prevEpisodes => [...prevEpisodes, updatedEpisodeUploadData]);
            }
        } catch (err) {
            console.error("Error", err);
        }
    };

    const deleteEpisode = async (episodeTitle, episodeNo) => {
        try {
            const storageRef = ref(storage, `movies/${contentUploadData.title}/episodes/${episodeNo}.mp4`);
            await deleteObject(storageRef);
            setEpisodes(prevEpisodes => prevEpisodes.filter(episode => episode.title !== episodeTitle));
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    return (
        <>
        {
            load ? (
                <Loader />
            ) : (
                <UploadForm onSubmit={handleUpload} method="post">
                    <InputGroup>
                        <Label>Title</Label>
                        <Input
                        name="title"
                        onChange={handleInputChange}
                        value={contentUploadData.title}
                        type="text"
                        placeholder="Eg: Raya"
                        required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Sub Title</Label>
                        <Input
                        name="subTitle"
                        onChange={handleInputChange}
                        value={contentUploadData.subTitle}
                        type="text"
                        placeholder="Eg: 2021 • 1h 52m • Family, Fantasy, Animation, Action-Adventure"
                        required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Description</Label>
                        <Textarea
                        name="description"
                        onChange={handleInputChange}
                        value={contentUploadData.description}
                        placeholder="Eg: Watch with Premier Access at the same time it's in open theaters and before it's available to all Disney+ subscribers on June 4, 2021."
                        required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Card Image</Label>
                        <FileInput
                        name="cardImg"
                        onChange={handleFileInputChange}
                        type="file"
                        accept="image/*"
                        required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Background Image</Label>
                        <FileInput
                        name="backgroundImg"
                        onChange={handleFileInputChange}
                        type="file"
                        accept="image/*"
                        required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Title Image</Label>
                        <FileInput
                        name="titleImg"
                        onChange={handleFileInputChange}
                        type="file"
                        accept="image/*"
                        required
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label>Upload Trailer</Label>
                        <FileInput
                        name="trailerURL"
                        onChange={handleFileInputChange}
                        type="file"
                        accept="image/*"
                        required
                        />
                    </InputGroup>
                    {
                        episodes.map((episode, i) => (
                            <EpisodeBox key={i}>
                                <Text>{episode.title}</Text>
                                <Text>{episode.type}</Text>
                                <Div>
                                    <Delete type='button' onClick={() => deleteEpisode(episode.title, episode.episodeNumber)}>Delete</Delete>
                                </Div>
                            </EpisodeBox>
                        ))
                    }
                    <Box>
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
                                <SubmitButton onClick={handleAddEpisode}>Add Episode</SubmitButton>
                                </>
                            )
                        }
                    </Box>
                    <SubmitButton type="submit">Upload Series</SubmitButton>
                </UploadForm>
            )
        }
        </>
    );
};

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

const Box = styled.div`
  padding: 20px 30px;
  border: 2px solid white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const EpisodeBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border: 2px solid white;
  padding: 0 20px;
`;

const Div = styled.div`
  display: flex;
  gap: 10px;
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
  color: white;
  font-size: 16px;
`;

export default UploadSeries;

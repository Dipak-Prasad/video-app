import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import Loader from "./Loader";

const UploadMovie = ({ closeRef }) => {

  const [load, setLoad] = useState(false);

  // Uploading a new movie - Meta Data
  const [contentUploadData, setContentUploadData] = useState({
    title: "",
    subTitle: "",
    description: "",
    type: "movie",
  });

  // Uploading a new movie - File Data
  const [contentFileInput, setContentFileInput] = useState({
    cardImg: null,
    backgroundImg: null,
    titleImg: null,
    movieURL: null,
    trailerURL: null
  });

  // onChange handler - Meta Data
  const handleInputChange = (e) => {
    setContentUploadData({
      ...contentUploadData,
      [e.target.name]: e.target.value,
    });
  };

  // onChange handler - File Data
  const handleFileInputChange = (e) => {
    setContentFileInput({
      ...contentFileInput,
      [e.target.name]: e.target.files[0],
    });
  };

  // Upload function for content
  let uploadTasks = [];
  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      setLoad(true);
      uploadTasks = Object.keys(contentFileInput).map(async (key) => {
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
      if(docRef) {
        setLoad(false);
      }

      closeRef.current.click();

      alert("Content uploaded successfully");

      setContentUploadData({
        title: '',
        subTitle: '',
        description: '',
        type: 'movie',
      });

      setContentFileInput({
        cardImg: null,
        backgroundImg: null,
        titleImg: null,
        movieURL: null,
        trailerURL: null
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <>
    {
      load && (
        <Loader />
      )
    }
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
            accept="video/*"
            required
            />
        </InputGroup>
        <InputGroup>
            <Label>Upload Movie</Label>
            <FileInput
            name="movieURL"
            onChange={handleFileInputChange}
            type="file"
            accept="video/*"
            required
            />
        </InputGroup>
        <SubmitButton type="submit">Upload Movie</SubmitButton>
    </UploadForm>
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

const Select = styled.select`
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
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

export default UploadMovie;

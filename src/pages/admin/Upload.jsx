// import React, { useState, useEffect, useRef } from 'react';
// import Popup from 'reactjs-popup';
// import styled from 'styled-components';
// import AdminSidebar from "../../components/admin/AdminSidebar";
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../../lib/firebase';
// import { FaArrowCircleLeft } from "react-icons/fa";
// import UploadItem from '../../components/admin/UploadItem';
// import UploadMovie from '../../components/admin/UploadMovie';
// import UploadSeries from '../../components/admin/UploadSeries';

// const Upload = () => {
//   const [content, setContent] = useState([]);
//   const closeRef = useRef(null);
//   const [uploadType, setUploadType] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const contentSnapshot = await getDocs(collection(db, "movies"));
//         const contentData = contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setContent(contentData);
//       } catch(err) {
//         console.error(err);
//       }
//     }

//     fetchData();
//   }, [setContent]);

//   const handleUploadType = (type) => {
//     setUploadType(type);
//   }

//   return (
//     <div className="admin-container">
//       <AdminSidebar />
//       <main className="dashboard-app-container">
//         <Container>
//           <Box>
//             <Heading>Uploaded Content</Heading>
//             <Popup trigger={<NewUpload>New Content</NewUpload>} closeOnDocumentClick={false} closeOnEscape={false} modal nested>
//               {
//                 close => (
//                   <Modal>
//                     <MenuBar>
//                       <CloseBtn onClick={() => {close(); setUploadType(null)}} ref={closeRef}>
//                         <FaArrowCircleLeft />
//                       </CloseBtn>
//                       <Description>Upload a movie</Description>
//                     </MenuBar>
//                     {
//                       uploadType === null && (
//                         <Div>
//                           <Description>Select Category</Description>
//                           <SelectButton onClick={() => handleUploadType("movie")}>Movie</SelectButton>
//                           <Description>Or</Description>
//                           <SelectButton onClick={() => handleUploadType("series")}>Series</SelectButton>
//                         </Div>
//                       )
//                     }
//                     {
//                       uploadType === "movie" && (
//                         <UploadMovie closeRef={closeRef} />
//                       )
//                     }
//                     {
//                       uploadType === "series" && (
//                         <UploadSeries closeRef={closeRef} />
//                       )
//                     }
//                   </Modal>
//                 )
//               }
//             </Popup>
//           </Box>
//           <CenteredContent>
//             <Uploads>
//               {
//                 content.map(movie => (
//                   <UploadItem key={movie.id} movie={movie} closeRef={closeRef} setContent={setContent} />
//                 ))
//               }
//             </Uploads>
//           </CenteredContent>
//         </Container>
//       </main>
//     </div>
//   );
// }

// const Container = styled.div`
//   padding: 20px 60px;
//   padding-left: 300px;
//   height: 100vh;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
// `;

// const Box = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const CenteredContent = styled.div`
//   flex-grow: 1;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const Uploads = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-top: 30px;
//   gap: 10px;
//   height: 80vh;
//   overflow: scroll;

//   &::-webkit-scrollbar {
//     display: none;
//   }
// `;

// const Heading = styled.h2`
//   color: #090b13;
// `;

// const NewUpload = styled.button`
//   font-weight: bold;
//   color: #f9f9f9;
//   background-color: #0063e5;
//   font-size: 18px;
//   padding: 10px 20px;
//   border: 1px solid transparent;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;

//   &:hover {
//     background-color: #0483ee;
//   }
// `;

// const Modal = styled.div`
//   width: 700px; 
//   max-height: 80vh;
//   overflow-y: auto;
//   background: url("/images/home-background.png") center center / cover;
//   border-radius: 12px;
//   border: 2px solid rgb(249, 249, 249);
//   margin: auto;
//   margin-top: 30px;
//   padding: 10px;

//   &::-webkit-scrollbar {
//     display: none;
//   }

//   @media (max-width: 768px) {
//     width: auto;
//     margin: auto 13px;
//   }
// `;

// const MenuBar = styled.div`
//   width: 100%;
//   padding: 4px 12px;
//   border-bottom: 2px solid #f9f9f9;
//   display: flex;
//   align-items: center;
// `;

// const Description = styled.div`
//   line-height: 1.4;
//   font-size: 20px;
//   padding: 16px 0px;
//   color: #f9f9f9;
// `;

// const CloseBtn = styled.button`
//   background: transparent;
//   border: none;
//   outline: none;
//   color: rgb(249, 249, 249);
//   font-size: 22px;
// `;

// const Div = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-top: 20px;
//   gap: 20px;
//   align-items: center;
//   justify-content: center;
// `;

// const SelectButton = styled.button`
//   background-color: #0063e5;
//   color: #f9f9f9;
//   border: none;
//   border-radius: 5px;
//   padding: 10px;
//   cursor: pointer;
//   width: 250px;

//   &:hover {
//     background-color: #0483ee;
//   }
// `;

// export default Upload;
import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import AdminSidebar from "../../components/admin/AdminSidebar";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FaArrowCircleLeft } from "react-icons/fa";
import UploadItem from '../../components/admin/UploadItem';
import UploadMovie from '../../components/admin/UploadMovie';
import UploadSeries from '../../components/admin/UploadSeries';

const Upload = () => {
  const [content, setContent] = useState([]);
  const closeRef = useRef(null);
  const [uploadType, setUploadType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentSnapshot = await getDocs(collection(db, "movies"));
        const contentData = contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContent(contentData);
      } catch(err) {
        console.error(err);
      }
    }

    fetchData();
  }, [setContent]);

  const handleUploadType = (type) => {
    setUploadType(type);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <Container>
          <Box>
            <Heading>Uploaded Content</Heading>
            <Popup trigger={<NewUpload>New Content</NewUpload>} closeOnDocumentClick={false} closeOnEscape={false} modal nested>
              {
                close => (
                  <Modal>
                    <MenuBar>
                      <CloseBtn onClick={() => {close(); setUploadType(null)}} ref={closeRef}>
                        <FaArrowCircleLeft />
                      </CloseBtn>
                      <Description>Upload a movie</Description>
                    </MenuBar>
                    {
                      uploadType === null && (
                        <Div>
                          <Description>Select Category</Description>
                          <SelectButton onClick={() => handleUploadType("movie")}>Movie</SelectButton>
                          <Description>Or</Description>
                          <SelectButton onClick={() => handleUploadType("series")}>Series</SelectButton>
                        </Div>
                      )
                    }
                    {
                      uploadType === "movie" && (
                        <UploadMovie closeRef={closeRef} />
                      )
                    }
                    {
                      uploadType === "series" && (
                        <UploadSeries closeRef={closeRef} />
                      )
                    }
                  </Modal>
                )
              }
            </Popup>
          </Box>
          <CenteredContent>
            <Uploads>
              {
                content.map(movie => (
                  <UploadItem key={movie.id} movie={movie} closeRef={closeRef} setContent={setContent} />
                ))
              }
            </Uploads>
          </CenteredContent>
        </Container>
      </main>
    </div>
  );
}

const Container = styled.div`
  padding: 20px;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CenteredContent = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Uploads = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  gap: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Heading = styled.h2`
  color: #090b13;
`;

const NewUpload = styled.button`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  font-size: 18px;
  padding: 10px 20px;
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

const Modal = styled.div`
  width: calc(100% - 40px);
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
  word-wrap: break-word;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  color: rgb(249, 249, 249);
  font-size: 22px;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;

const SelectButton = styled.button`
  background-color: #0063e5;
  color: #f9f9f9;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  width: 250px;

  &:hover {
    background-color: #0483ee;
  }
`;

export default Upload;

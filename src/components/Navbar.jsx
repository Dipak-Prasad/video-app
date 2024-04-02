import React, { useEffect } from "react";
import styled from "styled-components";
import { auth } from "../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { selectUserName, selectUserPhoto, setSignOutState, setUserLoginDetails } from "../features/user/userSlice";
import NavContent from "./NavContent";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = ({ openNav, setOpenNav }) => {

  // Accessing logged in user credentials from store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);

  // Signout method
  const handleSignOut = async () => {
    if(username) {
      auth.signOut().then(() => {
        dispatch(setSignOutState());
        navigate('/');
      }).catch((err) => console.error(err.message));
    }
  }

  // Auto fetch when user changes
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if(user) {
        setUser(user);
      }
    });
  }, [username]);

  // Fetch logged in user creds from store
  const setUser = (user) => {
    dispatch(
      setUserLoginDetails({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      })
    );
  }

  return (
    <Nav opennav={openNav}>
        <XMark onClick={() => setOpenNav(false)}>
          <FaXmark />
        </XMark>
        <Logo>
            <img src="/images/tribesflix.png" alt="Disney+" />
        </Logo>
        {
          username ? (
            <NavContent setOpenNav={setOpenNav} userPhoto={userPhoto} username={username} handleSignOut={handleSignOut} />
          ) : (
            <Login href={'/signup'}>Signup</Login>
          )
        }
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 3;

  @media (max-width: 768px) {
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    top: ${props => props.opennav ? '0' : '-150%'};
    transition: all 0.3s ease-out;
  }
`;

const XMark = styled.button`
  display: none;

  @media (max-width: 768px) {
    background: transparent;
    outline: none;
    border: none;
    font-size: 27px;
    color: #ffffff;
    align-self: flex-end;
    position: absolute;
    right: 40px;
    top: 40px;
    display: block;
  }
`;

const Logo = styled.a`
  padding: 0;
  width: 150px;
  margin-top: 4px;
  max-height: 100px;
  font-size: 0;
  display: inline-block;

  img {
    display: block;
    width: 100%;
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;

export default Navbar;
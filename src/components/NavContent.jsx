import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavContent = ({ userPhoto, username, handleSignOut, setOpenNav }) => {
  return (
    <>
      <NavMenu>
            <Link to="/home" onClick={() => setOpenNav(false)}>
                <img src="/images/home-icon.svg" alt="HOME" />
                <span>HOME</span>
            </Link>
            <Link to={"/movies"} onClick={() => setOpenNav(false)}>
                <img src="/images/movie-icon.svg" alt="MOVIES" />
                <span>MOVIES</span>
            </Link>
            <Link to={"/series"} onClick={() => setOpenNav(false)}>
                <img src="/images/series-icon.svg" alt="SERIES" />
                <span>SERIES</span>
            </Link>
            <Link to={"/watchlist"} onClick={() => setOpenNav(false)}>
              <img src="/images/watchlist-icon.svg" alt="WATCHLIST" />
              <span>WATCHLIST</span>
            </Link>
            <Link to={'/search'} onClick={() => setOpenNav(false)}>
              <img src="/images/search-icon.svg" alt="SEARCH" />
                <span>SEARCH</span>
            </Link>
            <Link to={'/admin/dashboard'} onClick={() => setOpenNav(false)}>
              <img src="/images/original-icon.svg" alt="ORIGINALS" />
              <span>DASHBOARD</span>
            </Link>
      </NavMenu>
      <SignOut>
        <UserImg src={userPhoto} alt={username} />
        <DropDown>
          <span onClick={handleSignOut}>Sign Out</span>
        </DropDown>
      </SignOut>
    </>
  );
};

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: flex-end;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;

  a {
    display: flex;
    align-items: center;
    padding: 0 12px;
    justify-content: center;
    gap: 5px;

    img {
      height: 20px;
      min-width: 20px;
      width: 20px;
      z-index: auto;
    }

    span {
      color: rgb(249, 249, 249);
      font-size: 13px;
      letter-spacing: 1.42px;
      line-height: 1.08;
      padding: 2px 0px;
      white-space: nowrap;
      position: relative;

      &:before {
        background-color: rgb(249, 249, 249);
        border-radius: 0px 0px 4px 4px;
        bottom: -6px;
        content: "";
        height: 2px;
        left: 0px;
        opacity: 0;
        position: absolute;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }
    }

    &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1 !important;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
    margin: 50px 0;
    height: auto;
  }
`;

const UserImg = styled.img`
  height: 100%;
`;

const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  ${UserImg} {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  &:hover {
    ${DropDown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

export default NavContent;

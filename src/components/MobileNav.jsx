import React from 'react';
import { IoMenu } from "react-icons/io5";
import styled from 'styled-components';

const MobileNav = ({ openNav, setOpenNav }) => {
  return (
    <Nav>
        <Logo>
            <img src="/images/tribesflix.png" alt="Tribesflix" />
        </Logo>
        <Menu onClick={() => setOpenNav(!openNav)}>
            <IoMenu />
        </Menu>
    </Nav>
  )
}

const Nav = styled.nav`
  display: none;

  @media (max-width: 768px) {
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

const Menu = styled.button`
    background: transparent;
    outline: none;
    border: none;
    font-size: 27px;
    color: #ffffff;
`;


export default MobileNav;
import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import styled from "styled-components";

const Toss = () => {
  const [angle, setAngle] = useState(0);

  const flipCoin = () => {
    if (Math.random() > 0.5) setAngle((prev) => prev + 180);
    else setAngle((prev) => prev + 360);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <MainContainer>
        <h1>Toss</h1>
        <TossContainer>
          <TossCoin onClick={flipCoin} angle={angle}>
            <CoinSide />
            <CoinSide />
          </TossCoin>
        </TossContainer>
      </MainContainer>
    </div>
  );
};

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TossContainer = styled.section`
  margin-top: 20px;
  perspective: 1000px;
`;

const TossCoin = styled.article`
  width: 150px;
  height: 150px;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  transform: ${({ angle }) => `rotateY(${angle}deg)`};
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const CoinSide = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 50%;
  background-color: #f1c40f;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

export default Toss;

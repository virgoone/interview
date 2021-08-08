import React from 'react';
import styled, { keyframes } from 'styled-components';

interface StyleProps {
  [key: string]: string | number;
}

const commonStyle = {
  margin: 'auto',
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

const stretchdelay = keyframes`
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
`;

const LoadContainer = styled.div`
  width: 100px;
  height: ${(props: StyleProps) => `${props.size}` || '40px'};
  text-align: center;
  font-size: 10px;
`;

const box = styled.div`
  background-color: ${(props: StyleProps) => props.color || '#111'};
  height: 100%;
  width: 3px;
  display: inline-block;
  margin-left: 5px;
  animation: ${stretchdelay} ${(props: StyleProps) => props.speed || 1.2}s
    infinite ease-in-out;
`;

const BoxLoadingFirst = styled(box)`
  animation-delay: -1.2s;
`;

const BoxLoadingTwo = styled(box)`
  animation-delay: -1.1s;
`;

const BoxLoadingThree = styled(box)`
  animation-delay: -1s;
`;

const BoxLoadingFour = styled(box)`
  animation-delay: -0.9s;
`;

const BoxLoadingFive = styled(box)`
  animation-delay: -0.8s;
`;

const WaveLoading = ({
  style = commonStyle,
  color,
  speed,
  size = '40px',
}: {
  style: any
  color: string
  speed: number
  size: string
}) => {
  return (
    <LoadContainer style={style} size={size}>
      <BoxLoadingFirst color={color} speed={speed} />
      <BoxLoadingTwo color={color} speed={speed} />
      <BoxLoadingThree color={color} speed={speed} />
      <BoxLoadingFour color={color} speed={speed} />
      <BoxLoadingFive color={color} speed={speed} />
    </LoadContainer>
  );
};

export default WaveLoading;

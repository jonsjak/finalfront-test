import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CameraLogo, GlobeLogo } from 'components/styles/Images';
import { DiagonalBox, HeaderContainer } from 'components/styles/Containers';
import logo from '../../images/movie-logo6.png';
import globe from '../../images/173986775earth-spinning-rotating-animation-15-2.gif';

export const Header = () => {
  const showHeader = useSelector((store) => store.menus.headerMenuShowing);
  return (
    <div>
      {showHeader
      && (
        <HeaderContainer>
          <DiagonalBox />
          <Link to="/">
            <CameraLogo
              src={logo}
              alt="logo" />
            <GlobeLogo
              src={globe}
              alt="globe loader" />
          </Link>
        </HeaderContainer>
      )}
    </div>
  );
}
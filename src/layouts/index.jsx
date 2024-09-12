import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Nav from './components/nav';
import Main from './components/main';
import Header from './components/header';
import { Commet } from 'react-loading-indicators';
import { useSelector } from 'react-redux';
import { selectactive } from '../redux/activeSlice'

export default function Layout({ children }) {

  const [openNav, setOpenNav] = useState(false);
  const [isActive, setIsActive] = useState(false)

  const active = useSelector(selectactive)

  useEffect(() => {
    setIsActive(active)
  }, [active])

  return (
    <>
      <Header onOpenNav={() => setOpenNav(openNav)} />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(openNav)} />
        {isActive && (<Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          background: '#111111',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          flexWrap: 'wrap',
          zIndex: 9999,
          opacity: 0.8
        }}>
          <Commet color="#df1077" size="medium" text="Loading..." textColor="" />
        </Box>)}
        <Main>{children}</Main>
      </Box>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

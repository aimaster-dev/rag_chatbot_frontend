import PropTypes from 'prop-types';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Nav from './components/nav';
import Main from './components/main';
import Header from './components/header';


export default function Layout({ children }) {

  const [openNav, setOpenNav] = useState(false);

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
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(openNav)}/>
        <Main>{children}</Main>
      </Box>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

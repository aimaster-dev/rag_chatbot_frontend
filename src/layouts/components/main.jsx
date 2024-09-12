import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { useResponsive } from '../../hooks/use-responsive';
import { NAV } from './utils/config-layout';

// const SPACING = 30;

export default function Main({ children, sx, ...other }) {
  const lgUp = useResponsive('up', 'lg');
  const styles = {
    container: {
      width:'100%'
    }
  }
  return (
    <main style={ styles.container }>
      <Box
        sx={{
          opacity: 1,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '20px',
          paddingTop: 8,
          ...(lgUp && {
            px: 2,
            paddingTop:12,
            paddingLeft: '41px',
            width: `calc(100% - ${NAV.WIDTH}px)`,
          }),
          ...sx
        }}
        
      ></Box>
      
      {children}
    </main>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

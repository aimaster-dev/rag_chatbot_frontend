import PropTypes from 'prop-types'; 
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useResponsive } from '../../hooks/use-responsive';
import { bgBlur } from './utils/css';
import Iconify from './utils/iconify';
import { NAV, HEADER } from './utils/config-layout';
import AccountPopover from './utils/account-popover';

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');
  // const [setIsMobileMenuOpen] = useState(false);

  const styles = {
    container: {
        fontSize: 40,
        fontFamily: "DIN-Bold",
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 0,
        backgroundColor:'#1976d2'
    }
  }

  const renderContent = (
    <>
      {/* {!lgUp && (
        <IconButton onClick={() => setIsMobileMenuOpen(true)} sx={{ mr: 1 }}> 
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )} */}

      {!lgUp && (
        <IconButton sx={{ mr: 1 }}> 
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Typography sx={ styles.container } />
      
      <Box sx={{ flexGrow: 1 }} />
      <Stack direction="row" alignItems="center" spacing={1}>
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: '#DFE2EA',
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

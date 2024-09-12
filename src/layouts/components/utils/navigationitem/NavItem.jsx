import PropTypes from 'prop-types';

import { alpha } from '@mui/material/styles';
import { Box, ListItemButton } from '@mui/material';

import { usePathname } from '../../../../hooks/use-pathname';

import RouterLink from '../router-link';

export default function NavItem({ item }) {
    const pathname = usePathname();
    const active = item.path === pathname;
  
    return (
      <ListItemButton
        component={RouterLink}
        href={item.path}
        sx={{
          fontFamily: 'PingFang SC-Bold',
          fontWeight: 'bold',
          color: '#FFFFFF',
          opacity: 0.7,
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          textTransform: 'capitalize',
          ...(active && {
            color: '#FFFFFF',
            opacity: 1,
            fontWeight: 'fontWeightSemiBold',
            bgcolor: '#444444',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          <img src={item.iconpath} alt="Logo" />
        </Box>
        <Box component="span">{item.title} </Box>
      </ListItemButton>
    );
  }
  
  NavItem.propTypes = {
    item: PropTypes.object,
  };
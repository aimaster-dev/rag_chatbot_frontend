import { useState } from 'react';

import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { emptyToken } from './api';

const account = {
  displayName: 'J',
  email: '',
  photoURL: '/assets/images/avatars/avatar_25.jpg',
};

export default function AccountPopover() {

  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    emptyToken();
    setOpen(null);
    navigate('/login')
  };

  const handleClosewin = () => {
    setOpen(null);
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          borderRadius:90,
          background:'#FFFFFF',
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 'circle',
            opacity: 1,
            backgroundColor:'#58B0E0'
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </Button>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClosewin}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleClose}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Log out
        </MenuItem>
      </Popover>
    </>
  );
}

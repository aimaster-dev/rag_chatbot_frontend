/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useResponsive } from '../hooks/use-responsive';
import Button from '@mui/material/Button';
import { getSelDoc, updateDocument } from '../layouts/components/utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setactive } from '../redux/activeSlice'

const DBManage = () => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [active, setActive] = useState(false)
  const lgUp = useResponsive('up', 'lg');
  const dispatch = useDispatch()

  const styles = {
    description: {
      display: 'flex',
      gap: '6px'
    },

    titles: {
      fontSize: '48px',
      fontWeight: 'bold',
      textAlign: 'left',
      background: 'transparent',
      width: '100%'
    },

    titleSection: {
      display: 'flex',
      alignItems: 'start',
      gap: '10px',
      marginBottom: '10px'
    },

    descSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      color: 'gray',
      marginBottom: '30px'
    },
    textEdit: {
      width: '100%',
      fontSize: '16px'
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      padding: '0px',
      width: '100%'
    },
    headerSection: {
      display: 'flex',
      justifyContent: 'end',
      height: 35
    }
  }

  const selItem = getSelDoc();

  const initData = () => {
    setTitle(selItem.title)
    setContent(selItem.content)
  }

  useEffect(() => {

    initData()

  }, [])

  const handleTitleChange = (e) => {

    setTitle(e.target.value)
    setActive(true)
  }

  const handleTextEdit = (e) => {
    setContent(e.target.value)
    setActive(true)
  }

  const handleSave = async () => {
    
    try{
      const id = selItem.id;
      const collection_id = selItem.collection_id
      dispatch(setactive(true))
      await updateDocument({ id, collection_id, title, content })
      setActive(false)
      dispatch(setactive(false))
    }catch(err) {
      toast('The blank document is already existed in this collection.')
    }
    
  }

  return (
    <Box sx={{
      paddingLeft: 2,
      paddingRight: 2,
      ...(lgUp && {
        paddingLeft: 24,
        paddingRight: 24,
      }),
    }}
    >
      <Box sx={styles.container}>
        <Box sx={styles.headerSection}>
          {active ? (<Button variant="contained" onClick={handleSave} >Save</Button>) : (<Button variant="contained" onClick={handleSave} disabled>Save</Button>)}
        </Box>
        <Box style={styles.titleSection}>
          <StarRateIcon sx={{ fontSize: 48, paddingTop: 1 }} />
          <TextField
            variant="standard"
            value={title}
            inputProps={{
              style: { fontSize: 48, fontWeight: 600, lineHeight: 1, },
              maxLength: 50
            }}
            style={styles.titles}
            onChange={handleTitleChange}
            multiline
            maxRows={4}
            maxLength={12}
          />
        </Box>

        <TextField
          variant="standard"
          placeholder="Type '/' to insert, or start writing..."
          value={content}
          sx={styles.textEdit}
          InputProps={{
            disableUnderline: true,
            readOnly: false,
            style: { fontSize: 16, fontWeight: 500 },
          }}
          onChange={handleTextEdit}
          multiline
        />
      </Box>
      <div>
        <ToastContainer/>
      </div>
    </Box>
  );
};

export default DBManage;

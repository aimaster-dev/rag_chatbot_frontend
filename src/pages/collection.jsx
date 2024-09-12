/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef,useCallback } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useResponsive } from '../hooks/use-responsive';
import { updateCollection, getDocuments, deleteDocument, setSelDoc, getSelCollection } from '../layouts/components/utils/api';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { createDocument } from '../layouts/components/utils/api';
import IconButton from '@mui/material/IconButton';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { ToastContainer, toast } from 'react-toastify';

const Collection = () => {

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [documents, setDocuments] = useState([]);
  const [collectionID, setCollectionID] = useState();
  const lgUp = useResponsive('up', 'lg');
  const navigate = useNavigate();
  const [active, setActive] = useState(false)
  const prevSelectedItem = useRef();

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
      fontSize: '16px',
      fontWeight: 500,
      paddingLeft: 7,
      paddingRight: 7,
      maxRows: 2
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
    },
    card: {
      background: '#EFEFEF',
      padding: 6,
      paddingLeft: 24,
      borderRadius: 4,
      margin: 6,
      cursor: 'pointer'
    }
  }

  const selecteditem = getSelCollection();
  const data = localStorage.getItem('collection')
  const handleDoc = (item) => {

    setSelDoc(JSON.stringify(item))
    navigate('/dbmanage')
  }

  const handleDel = async (id) => {
   
    try{
   
      await deleteDocument(selecteditem.id , id);
      initData();
      toast('Successfuly removed')
   
    }catch(err){
      toast('Interupt error')
    }
    
  };

  const initData = useCallback(async () => {
    if (selecteditem) {
      try {
        setCollectionID(selecteditem.id);
        setTitle(selecteditem.name);
        setComment(selecteditem.description);
  
        const response = await getDocuments(selecteditem.id);
  
        if (response && response.status === 200) {
          setDocuments(response.data);
        } else {
          console.error("Failed to fetch documents");
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    } else {
      console.error("selecteditem is undefined or null");
    }
  }, [selecteditem]);
 
  const handleNewDoc = async () => {
    try{

      const data = await createDocument(selecteditem.id);
      setSelDoc(JSON.stringify(data.data))
      navigate('/dbmanage')
      toast('Successfully added new document')
    
    }catch(err){
      toast('Interupt error')
    }
  }

  useEffect(() => {

    if (selecteditem && selecteditem !== prevSelectedItem.current) {
      initData();
      prevSelectedItem.current = selecteditem; 
    }

  }, [data]);

  const renderDoc = () => {
    return (
      <Box mt={2} paddingLeft={7} paddingRight={7}>
        {
          documents && documents.map((items, index) => (
            <Box key={index} onClick={() => handleDoc(items)} style={styles.card}>
              <Typography variant="h6">{items.title}</Typography>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body2" color="textSecondary">
                  You created {items.created_time}
                </Typography>
                <IconButton size="small" onClick={() => handleDel(items.id)}>
                  <DeleteOutline fontSize="small" sx={{ color: '#DD0000' }} />
                </IconButton>
              </Box>
            </Box>
          ))
        }
      </Box>
    );
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setActive(true)
  }

  const handleComment = (e) => {
    setComment(e.target.value);
    setActive(true)
  }

  const handleSaveDoc = async () => {

    try{
      
      await updateCollection({ collectionID, title, comment });
      navigate('/index')
      setActive(false)
      toast('Successfully saved')

    }catch (err) {
      toast("The blank document is already existed in this collection.")
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
          {
            active ? (<Button variant="contained" onClick={handleSaveDoc}>
              Save
            </Button>) : (<Button variant="contained" onClick={handleSaveDoc} disabled>
              Save
            </Button>)
          }

        </Box>

        <Box style={styles.titleSection}>
          <AccessTimeOutlinedIcon sx={{ fontSize: 48, paddingTop: 1 }} />
          <TextField
            variant="standard"
            value={title}
            inputProps={{
              style: { fontSize: 48, fontWeight: 600, lineHeight: 1 },
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
          placeholder="Type comment writing..."
          multiline
          value={comment}
          sx={styles.textEdit}
          InputProps={{
            disableUnderline: true,
            readOnly: false,
            style: { fontSize: 16, fontWeight: 500, color: '#A1A1A1' },
          }}
          onChange={handleComment}
        />

        <Box sx={styles.headerSection}>
          {
            <Button variant="contained" onClick={handleNewDoc}>
              + New Document
            </Button>
          }
        </Box>
        {/* Ensure renderDoc is called correctly */}
        {renderDoc()}
      </Box>
      <div>
        <ToastContainer/>
      </div>
    </Box>

  );
};

export default Collection;

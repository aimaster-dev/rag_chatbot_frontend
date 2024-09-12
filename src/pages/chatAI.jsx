import React, { useEffect, useState } from 'react';
import { Container, TextField, Typography, Box, Card, CardContent, IconButton, InputAdornment, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { getAnswer, getcollectionsf, getHistory } from '../layouts/components/utils/api';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer, toast } from 'react-toastify';

const ChatAI = () => {

  const [answer, setAnswer] = useState('')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([0]);
  const [histories, setHistories] = useState([])
  const collections = getcollectionsf()
  const contentData = { id: 0, name: 'Any Collection' }
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    history: {
      borderRadius: 4,
      width: 300,
      textAlign: 'center'
    },
    card: { 
      mb: 2, 
      background: '#EFEFEF',
      border: 'hidden',
      borderRadius: 4, 
      textAlign: 'left',
      cursor: 'pointer'
    },
    cardwrap: { 
      mb: 2, 
      background: '#EFEFEF', 
      border: 'hidden', 
      borderRadius: 4 
    },
    searchIcon: {
      fontSize: 24, 
      fontWeight: 'bold'
    }
  }

  useEffect(() => {

    fetchHistoryData()

  }, [])

  const handleKeyDown = (event) => {
    try {
      if (event.key === 'Enter') {
        fetchData()
      }
    } catch (event) {
      console.log("Error : ", event)
    }
  }

  const handlePrompt = (e) => {
    setQuery(e.target.value)
  }

  const handleHistory = (item) => {
    console.log(item.query)
    setQuery(item.query)
    const collectionIds = item.collections.map(collection => collection.id);
    setSelectedIds( collectionIds )
    fetchData()

  }

  const fetchData = async () => {

    if(!query.trim()){
      toast('Please input query')
      return
    }
    const response = await getAnswer(query, selectedIds)
    if (response.status === 200) {
      setAnswer(response.data);
    }else{
      toast('Server error! ')
    }
  }

  const fetchHistoryData = async () => {

    const his_response = await getHistory()
    if (his_response.status === 200) {
      setHistories(his_response.data)
    }
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedIds(typeof value === 'string' ? value.split(',') : value);
  };

  const renderSelectedNames = (selected) => {

    return selected
      .map((id) => {
        const selectedItem = collections.find((entry) => entry.id === id);
        return selectedItem ? selectedItem.name : contentData.id === id ? contentData.name : ''
      })
      .join(', ');
  };

  return (

    <Container sx={{ mt: 4 }}>
      <Box mb={4} display="flex">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search or ask a question..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={ styles.searchIcon } />
              </InputAdornment>
            ),
            sx: {
              input: {
                fontSize: '24px',
                fontFamily: 'sans-serif',
                fontWeight: 600,
                padding: 2
              },
              border: '1px solid #E1E1',
              borderRadius: 5
            }
          }}
          onKeyDown={handleKeyDown}
          value={query}
          onChange={handlePrompt}
        />
      </Box>

      <Box sx={styles.container}>
        <Box>
          <Box display="flex" mb={2}>
            <Select
              labelId="multiple-select-label"
              multiple
              value={selectedIds}
              onChange={handleChange}
              renderValue={(selected) => renderSelectedNames(selected)} >
              <MenuItem key={contentData.id} value={contentData.id}>
                <Checkbox checked={selectedIds.indexOf(contentData.id) > -1} />
                <ListItemText primary={contentData.name} />
              </MenuItem>
              {collections.map((entry) => (
                <MenuItem key={entry.id} value={entry.id}>
                  <Checkbox checked={selectedIds.indexOf(entry.id) > -1} />
                  <ListItemText primary={entry.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>
          
          { answer && (<Card key={answer.id} variant="outlined" sx={ styles.cardwrap }>
              <CardContent>
                <Typography variant="h6" paragraph>{answer.user}</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Answer: {answer.answer}
                </Typography>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton >
                    <ThumbUpIcon width={10}  height={10}/>
                  </IconButton>
                  <IconButton>
                    <ThumbDownIcon width={10} height={10} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>)
          }
        </Box>

        <Box sx={styles.history}>
          <Typography variant='h6' paragraph>History</Typography>

          {histories && histories.map((item, index) => (
            <Card key={index} variant="outlined" sx={ styles.card } onClick={() => handleHistory(item)}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Q: {item.query}
                </Typography>
                <Typography variant="body1" paragraph>
                  {item.bot_response}
                </Typography>
                <Typography variant="body2" >{'collection'}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <div>
          <ToastContainer />
        </div>
      </Box>
    </Container>
  );
};

export default ChatAI;

import React, { useEffect, useState } from 'react';
import { Container, TextField, Typography, Box, Card, CardContent, IconButton, InputAdornment, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { getAnswer, getcollectionsf, getHistory, getonedoc, setSelDoc } from '../layouts/components/utils/api';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setactive } from '../redux/activeSlice';

const ChatAI = () => {

  const [answer, setAnswer] = useState('')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([0]);
  const [histories, setHistories] = useState([])
  const collections = getcollectionsf()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const contentData = { id: 0, name: 'Any Collection' }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

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
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      left: 50
    },
    cursor: {
      cursor: 'pointer'
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
    
    setQuery(item.query)
    setSelectedIds(item.collections.length === 0 ? [0] : item.collections)
    fetchData()
  }

  const fetchData = async () => {

    if (query.trim() === null) {
      toast('Please input query')
      return
    }
   
    dispatch(setactive(true))
    const response = await getAnswer(query, selectedIds)
    if ( response && response.status && response.status === 200 ) {
      setAnswer(response.data);
    } else {
      toast('Server error! ')
    }
    dispatch(setactive(false))

  }
console.log(answer.source_data)
  const fetchHistoryData = async () => {

    const his_response = await getHistory()
    if ( his_response && his_response.status && his_response.status === 200) {
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
    if(!collections) {
      return "Any Collection"
    }

    return selected
      .map((id) => {
        const selectedItem = collections.find((entry) => entry.id === id);
        return selectedItem ? selectedItem.name : contentData.id === id ? contentData.name : ''
      })
      .join(', ');
  };

  const handleRef = async (data) => {
  
    if(!data || data.length === 0){
      toast("There is no refference")
      return;
    }

    const response =  await getonedoc(data[0].collection_id, data[0].document_id)
    if( response && response.status && response.status === 200 )
      {
        setSelDoc(JSON.stringify(response.data))
        navigate('/dbmanage')
      }else{
        toast('There is no exist document')
      }
  }

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
                <SearchIcon sx={styles.searchIcon} />
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

        <Box mr={2}>

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
              {collections && collections.map((entry) => (
                <MenuItem key={entry.id} value={entry.id}>
                  <Checkbox checked={selectedIds.indexOf(entry.id) > -1} />
                  <ListItemText primary={entry.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>
          {answer && (<Card key={answer.id} variant="outlined" sx={styles.cardwrap}>
            <CardContent>
              <Typography variant="h6" paragraph>{answer.user}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Answer: {answer.answer}
              </Typography>
              <Box  sx={ styles.cursor } overflow={'hidden'} onClick={() => handleRef(answer.source_data)}>
              <Typography variant="button" color="textSecondary" paragraph >
                Ref: {answer.source_data && answer.source_data.length > 0 && answer.source_data[0].paragraph}
              </Typography></Box>
              <Box display="flex" justifyContent="flex-end">
                <IconButton >
                  <ThumbUpIcon width={10} height={10} />
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
            <Card key={index} variant="outlined" sx={styles.card} onClick={() => handleHistory(item)}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Q: {item.query}
                </Typography>
                <Typography variant="body1" paragraph>
                  {item.bot_response}
                </Typography>
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

import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useNavigate } from 'react-router-dom';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { createCollection, deleteCollection, getDocuments, setSelCollection } from './api';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setactive } from '../../../redux/activeSlice';

export default function BasicSimpleTreeView({ data = [], refresh }) {

  const navigate = useNavigate();
  const [trees, setTrees] = React.useState(data);
  const dispatch = useDispatch();

  const styles = {
    divide: {
      marginTop: '32px',
      marginBottom: '12px',
    },
    title: {
      fontSize: 14,
      color: '#A2A2A2',
    },
    line: {
      height: '2px',
      backgroundColor: '#EDEEF2',
    },
    treeBackground: {
      background: '#F4F5F7',
    },
    treeItemLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    center: {
      position:'absolute'
    }
  };


  useEffect(() => {
    setTrees(data)
  }, [data]);


  const renderTree = () => {
    if (!trees.length) {
      return <div>No collections available</div>;
    }

    return (
      <SimpleTreeView
        expandedItems={['grid']}
        slots={{
          expandIcon: RemoveRedEyeIcon,
          collapseIcon: GolfCourseIcon,
          endIcon: StarRateIcon,
        }}
      >
        {trees && trees.map((item, index) => (
          <TreeItem
            key={item.id}
            itemId={String(index)}  // Convert index to string
            label={
              <div style={styles.treeItemLabel}>
                <span>{item.name}</span>
                <Box>
                  <IconButton size="small" onClick={() => handleDel(item.id)}>
                    <DeleteOutline fontSize="small" sx={{ color: '#DD0000' }} />
                  </IconButton>
                </Box>
              </div>
            }
            sx={styles.treeBackground}
            onClick={() => handleCollection(item)}
          >
          </TreeItem>
        ))}
      </SimpleTreeView>
    );

  }

  const handleCollection = async (item) => {
    
    setSelCollection(JSON.stringify(item));
    const response = await getDocuments(item.id)

    navigate('/collection');
    const updatedTrees = trees.map((tree) => {
      if (tree.id === item.id) {
        return {
          ...tree,
          children: response.data, // Add the fetched child nodes to the 'children' field
        };
      }
      return tree;
    });
    setTrees(updatedTrees)
    
  };

  const handleDel = async (id) => {
    
    try{

      dispatch(setactive(true))
      await deleteCollection(id);
      navigate('/collection')
      dispatch(setactive(false))
      toast('Successfully deleted')

    }catch(err){

      toast('Interupt error')
      
    }
    
  };

  const handleChatAI = () => {
    navigate('/index');
  };


  const handlenew = async () => {

    try{

      dispatch(setactive(true))
      await createCollection();
      refresh();
      dispatch(setactive(false))
      toast("Successfully added! ")

    }catch (err){
      toast("Interupt errors.")
    }

  };

  return (
    <Box>
      <SimpleTreeView
        slots={{
          expandIcon: SearchOutlinedIcon,
          collapseIcon: SearchOutlinedIcon,
          endIcon: SearchOutlinedIcon,
        }}
      >
        <TreeItem itemId="pickers" label="Search" className="MuiTreeItem-custom-label" onClick={handleChatAI} />
      </SimpleTreeView>

      <div style={styles.divide}>
        <div style={styles.title}>Collections</div>
        <div style={styles.line}></div>
      </div>

      {renderTree()}
      
      <SimpleTreeView
        slots={{
          expandIcon: AddIcon,
          collapseIcon: AddIcon,
          endIcon: AddIcon,
        }}
        sx={styles.title}
      >
        <TreeItem itemId="grid-new" label="New Collection" sx={styles.treeBackground} onClick={handlenew} />
      
      </SimpleTreeView>
      <div>
          <ToastContainer />
      </div>
    </Box>
  );
}

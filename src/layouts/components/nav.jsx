/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useResponsive } from '../../hooks/use-responsive';
import { NAV } from './utils/config-layout';
import { usePathname } from '../../hooks/use-pathname';
import BasicSimpleTreeView from './utils/treeview';
import logo from '../../assets/image/chatting.png'
import { getCollections, setcollections, setRefresh } from './utils/api';
import { useDispatch } from 'react-redux';
import { setactive } from '../../redux/activeSlice';

export default function Nav( { openNav, onCloseNav } ) {

    const upLg = useResponsive('up', 'lg');
    const [collection, setCollection] = useState([]);
    const pathname = usePathname();
    const dispatch = useDispatch();

    const styles = {
        container: {
            flexShrink: { lg: 0 },
            width: { lg: NAV.WIDTH },
        },
        wrap: {
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `solid 2px #EDEEF2`,
            bgcolor: '#F4F5F7',
            color: '#36455F',
            fontWeight: 500,
            fontSize: 24
        },
        topWrap: {
            my: 1,
            mx: 1,
            py: 2,
            px: 2.5,
            display: 'flex',
            borderRadius: 1.5,
            alignItems: 'center',
            textAlign: 'left',
        },
        image: {
            paddingRight: 10, 
            fontSize: 52, 
            color: '#d80afb', 
            width: '48px', 
            height: '48px'
        },
        title: { 
            fontSize: 24,
            fontFamily: 'Geist',
            fontWeight: 500,
            color: '#000000',
        },
        main: {
            display: 'flex',
            flexDirection: 'column', 
            marginLeft: 4, 
            marginTop: 12 
        },
        drawer: {

        }
    }
   
    const fetchData = async () => {
        dispatch(setactive(true))
       const response = await getCollections()
       if(response && response.status === 200){
    
        setCollection(response.data)
        setcollections(JSON.stringify(response.data))
        setRefresh(false)
       }
       dispatch(setactive(false))
    }
    const active = localStorage.getItem('active')
    useEffect(() => {

        if (openNav) {
            onCloseNav();
        }
        
        
        fetchData()
    }, [active, pathname]);

    return (
        <Box
            sx={ styles.container }
        >
            {upLg ? (
                <Box sx={ styles.wrap }>
                    <Box sx={ styles.topWrap }>
                        <img src={ logo } style={ styles.image } alt="logo" />
                        <Box>
                            <Typography variant="subtitle2" sx={ styles.title }>
                                RAG - AI ChatBot 1.0
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={ styles.main }>
                        <BasicSimpleTreeView data={ collection } refresh={ fetchData }/>
                    </Box>

                </Box>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    PaperProps={{
                        sx: {
                            width: NAV.WIDTH,
                        },
                    }}
                >
                    <Box sx={ styles.main }>
                        <BasicSimpleTreeView data={ collection } refresh={ fetchData }/>
                    </Box>
                </Drawer>
            )}
        </Box>
    );
}

Nav.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};



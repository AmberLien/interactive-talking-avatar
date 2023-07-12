import * as React from 'react';
import {ArrowBackIosNew} from '@mui/icons-material';
import {Box, Button, Typography, AppBar, Toolbar, IconButton} from '@mui/material';
import useStyle, {COLORS} from './styles';
import { useNavigate } from 'react-router-dom';
import {downloadRecording} from './webcam';

const Exit: React.FC = () => {
    const {boxWidth} = useStyle();
    const navigate = useNavigate();

    const handleYesButtonClick = () => {
        downloadRecording();
        navigate('/');
    };

    const handleNoButtonClick = () => {
        navigate('/character');
    };

    return (
        <Box component="div"
            sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            paddingLeft: '5vh',
            paddingRight: '5vh',
            bgcolor: COLORS.bgcolor,
            }}
        >
            <AppBar position="static"
                color="transparent"
                elevation={0}
                sx={{width: boxWidth, alignSelf: 'center'}}
            >
                <Toolbar className="tool-bar">
                    <Box component="div" className="shadow-back-button"
                        sx={{ justifyContent: 'center', color: COLORS.bgcolor}}
                    >
                        <IconButton onClick={handleNoButtonClick} aria-label="fullscreen">
                            <ArrowBackIosNew sx={{fontSize: '3vh', color: COLORS.primary}} />
                        </IconButton>
                    </Box>
                    <Typography
                        sx={{
                            fontFamily: 'Google Sans, sans-serif',
                            fontSize: '3vh',
                            paddingLeft: '2vh',
                            color: COLORS.primary,
                            }}>
                        Exit
                    </Typography>
                </Toolbar>
            </AppBar>
              <Box component="div" 
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    flexDirection: 'column',
                    position: 'relative',
                    fontFamily: 'Google Sans, sans-serif'
                }}>
                <Box component="div" sx={{width: '30vh', alignSelf: 'center',
                    borderRadius: '2.6vh',
                    boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    margin: '0 0 4vh 0',
                    bgcolor: '#FFFFFF',
                    fontFamily: 'Google Sans, sans-serif',
                    color: COLORS.primary}}>
                    <Box component="div" sx={{margin: '2vh 0 2vh 0'}}>
                        <p>Are you sure you want to exit?</p>
                    </Box>
                    <Box component="div" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Button variant="contained" sx={{ fontFamily: 'Google Sans, sans-serif', color: COLORS.bgcolor, marginBottom: '2vh'}} onClick={handleYesButtonClick}>Yes</Button>
                    <Button variant="contained" sx={{ fontFamily: 'Google Sans, sans-serif', color: COLORS.bgcolor, marginBottom: '2vh'}} onClick={handleNoButtonClick}>No</Button>
                </Box>
                </Box>
              </Box>
            </Box>
    );
}

export default Exit
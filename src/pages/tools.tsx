import * as React from 'react';
import {ArrowBackIosNew} from '@mui/icons-material';
import {Toolbar, IconButton, AppBar, Typography, Box, Checkbox, FormGroup, FormControlLabel, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import useStyle, {COLORS} from './styles';
import { startRecording } from './webcam';

export let useGoogleApi = false;
export let usePalmApi = false;

const Tools: React.FC = () => {

    const {boxWidth} = useStyle();

    const [state, setState] = React.useState({
        googleApi: usePalmApi,
        palmApi: useGoogleApi
    });

    const navigate = useNavigate();

    const handleContinueButtonClick = () => {
        navigate('/character');
        return;
    };

    const handleBackButtonClick = () => {
        navigate('/');
        return;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
        setState({
            ...state,
            [event.target.name]: event.target.checked 
        });

        if (event.target.name == 'googleApi') {
            useGoogleApi = !useGoogleApi;
        } else if (event.target.name =='palmApi') {
            usePalmApi = !usePalmApi;
        }

        return;
    };

    const renderAppBar = () => {
        return (
            <AppBar position="static"
                    color="transparent"
                    elevation={0}
                    sx={{width: boxWidth, alignSelf: 'center'}}>
                <Toolbar className="tool-bar">
                    <Box component="div" className="shadow-back-button"
                        sx={{ justifyContent: 'center', color: COLORS.bgcolor}}>
                        <IconButton onClick={handleBackButtonClick} aria-label="fullscreen">
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
                        Configuration Settings
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    };

    const renderToolsPage = () => {
        return (
            <Box component="div"
                sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: COLORS.bgcolor,
                }}>
                {renderAppBar()}
                <Box component="div" sx={{ width: boxWidth, height: '5vh' }}>
                </Box>
                <Box component="div" sx={{width: boxWidth, alignSelf: 'center',
                    borderRadius: '2.6vh',
                    boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    margin: '0 0 4vh 0',
                    bgcolor: '#FFFFFF',
                    fontFamily: 'Google Sans, sans-serif',
                    color: COLORS.primary}}>
                    <Box component="div" sx={{margin: 2}}>
                        <p>
                            Please select your configuration settings below. Note that in order to use the Google API and PaLM API, you need to have the appropriate API keys. Please add them into your .env file if you have not done so already. 
                        </p>
                    </Box>
                    <FormGroup sx={{margin: 2}}>
                        <FormControlLabel control={<Checkbox sx={{'&.MuiChecked': COLORS.primary}} checked={useGoogleApi} onChange={handleChange} name="googleApi"/>} label="Use Google API"></FormControlLabel>
                        <FormControlLabel control={<Checkbox sx={{'&.MuiChecked': COLORS.primary}} checked={usePalmApi} onChange={handleChange} name="palmApi"/>} label="Use PaLM API"></FormControlLabel>
                    </FormGroup>
                </Box>
                <Box component="div" sx={{width: boxWidth, height: '5vh'}}>
                </Box>
                <Box component="div" sx={{display: 'flex', width: boxWidth, alignSelf: 'center', justifyContent: 'center'}}>
                    <Button className = "shadow-update-button" sx={{color: COLORS.primary,}} onClick={() => {handleContinueButtonClick(); startRecording()}}>Continue</Button>
                </Box>
            </Box>
        );
    };

    return <>{renderToolsPage()}</>;
};

export default Tools;
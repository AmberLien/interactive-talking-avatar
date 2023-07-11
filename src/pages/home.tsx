import {Typography, Box, Button} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStyle, {COLORS} from './styles';

const Home: React.FC = () => {
    const {boxWidth} = useStyle();
    const navigate = useNavigate();

    const handleStartButtonClick = () => {
        navigate('/tools');
        return;
    };

    const renderHomePage = () => {
        return (
            <Box component="div"
                sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: COLORS.bgcolor,
                padding: '10vh'
                }}>
                <Box component="div"
                    position="static"
                    color="transparent"
                    sx={{width: boxWidth, alignSelf: 'center'}}
                >
                <Typography
                    sx={{
                    fontFamily: 'Google Sans, sans-serif',
                    fontSize: '3vh',
                    paddingLeft: '2vh',
                    color: COLORS.primary,
                    }}>
                    Interactive Talking Avatar
                </Typography>
                </Box>
                <Box component="div" sx={{ width: boxWidth, height: '5vh' }}>
                </Box>
                <Box component="div" sx={{alignSelf: 'center'}}>
                    <Button className = "shadow-update-button" sx={{color: COLORS.primary,}} onClick={handleStartButtonClick}>
                        Start
                    </Button>
                </Box>
            </Box>
        );
    };

    return <>{renderHomePage()}</>;
};

export default Home;
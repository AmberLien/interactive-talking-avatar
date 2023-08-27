import React, {useState, useContext} from 'react';
import {ArrowBackIosNew} from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {Box, Toolbar, Typography, IconButton, AppBar, Button, TextField} from '@mui/material';
import { ConfigContext } from '../context/config';
import useStyle, {COLORS} from './styles';
import { useNavigate } from 'react-router-dom';

const ConfigPersonality: React.FC = () => {
    const optionsTab = 'options';
    const personalityTab = 'personality';
    const backStoryTab = 'backStory';
    const knowledgeBaseTab = 'knowledgeBase';
    const config = useContext(ConfigContext);

    const [activeTab, setActiveTab] = useState(optionsTab);
    const [personalityText, setPersonalityText] = useState(config.state.personality);
    const [backStoryText, setBackStoryText] = useState(config.state.backStory);
    const [knowledgeBaseText, setKnowledgeBaseText] = useState(config.state.knowledgeBase);

    const navigate = useNavigate()
    
    const wordsLimitation = 3000;
    const {boxWidth} = useStyle();

    interface SettingField {
        key: string;
        title: string;
        tabName: string;
        value: string;
        setter: React.Dispatch<React.SetStateAction<string>>;
    }

    const fieldsMap = new Map<string, SettingField>([
        [
          personalityTab,
          {
            key: personalityTab,
            title: 'Personality',
            tabName: 'Character Personality',
            value: personalityText,
            setter: setPersonalityText,
          },
        ],
        [
          backStoryTab,
          {
            key: backStoryTab,
            title: 'Backstory',
            tabName: 'Backstory',
            value: backStoryText,
            setter: setBackStoryText,
          },
        ],
        [
          knowledgeBaseTab,
          {
            key: knowledgeBaseTab,
            title: 'Knowledge Base',
            tabName: 'Knowledge Base',
            value: knowledgeBaseText,
            setter: setKnowledgeBaseText,
          },
        ],
    ]);

    const handleFinishButtonClick = () => {
        if (
            !personalityText ||
            personalityText.trim() === '' ||
            !backStoryText ||
            backStoryText.trim() === '' ||
            !knowledgeBaseText ||
            knowledgeBaseText.trim() === ''
        ) {
            return handleCancelButtonClick();
        }
        config.setField('personality', personalityText);
        config.setField('backStory', backStoryText);
        config.setField('knowledgeBase', knowledgeBaseText);
        setActiveTab(optionsTab);
    }

    const handleContinueButtonClick = () => {
        navigate('/createAvatar');
    }

    const handleCancelButtonClick = () => {
        setPersonalityText(config.state.personality);
        setBackStoryText(config.state.backStory);
        setKnowledgeBaseText(config.state.knowledgeBase);
        setActiveTab(optionsTab);
        return;
    }

    const handleBackButtonClick = () => {
        switch (activeTab) {
            case optionsTab:
                navigate('/tools');
                break;
            default: 
                setActiveTab(optionsTab);
        }
    }

    const handleTextFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: SettingField | undefined
    ) => {
        if (field) {
        const text = event.target.value;
        const wordPattern = /\b\w+\b/g;
        const matches = text.match(wordPattern);
        const wordCount = matches ? matches.length : 0;

        if (wordCount > wordsLimitation && matches) {
            const truncatedText = matches.slice(0, wordsLimitation).join(' ');
            field.setter(truncatedText);
        } else {
            field.setter(text);
        }
        }
    };

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    }

    const renderAppBar = () => {
    const pageTitle = activeTab === optionsTab ? 'Customize' : fieldsMap.get(activeTab)?.title;
    return (
        <AppBar
        position="static"
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
            {pageTitle}
            </Typography>
        </Toolbar>
        </AppBar>
    );
    }

    const renderOptionsPage = () => {
        return (
        <Box
            component="div"
            sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: COLORS.bgcolor,
            alignItems: 'center'
            }}>
            {renderAppBar()}
            <Box component="div" sx={{ width: boxWidth, height: '10vh' }}>
            </Box>
            {[...fieldsMap.entries()].map(([key, value]) => (
            <Box
                component="div"
                key={key}
                sx={{
                display: 'flex',
                alignSelf: 'center',
                alignItems: 'center',
                width: boxWidth,
                height: '8vh',
                boxSizing: 'content-box',
                borderRadius: '2.6vh',
                boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)',
                overflow: 'hidden',
                margin: '0 0 4vh 0',
                bgcolor: '#FFFFFF',
                }}
                onClick={() => handleTabClick(key)}>
                <Typography
                sx={{
                    flexGrow: 1,
                    fontFamily: 'Google Sans, sans-serif',
                    fontSize: '2vh',
                    margin: '0 0 0 2vh',
                    color: COLORS.primary,
                }}
                align="left">
                {value.tabName}
                </Typography>
                <IconButton
                color="inherit"
                aria-label="upload"
                component="span"
                sx={{textAlign: 'right'}}>
                <FileUploadOutlinedIcon sx={{color: COLORS.primary}} />
                </IconButton>
            </Box>
            ))}
        <Button className = "shadow-update-button" sx={{color: COLORS.primary,}} onClick={handleContinueButtonClick}>Continue</Button>
        </Box>
        );
    };

    const renderContextUpdatePage = () => {
        return (
            <Box
            component="div"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                minHeight: '100vh',
                paddingLeft: '5vh',
                paddingRight: '5vh',
                bgcolor: COLORS.bgcolor,
            }}>
            {renderAppBar()}
            <Box
                component="div"
                className="shadow-box"
                key={fieldsMap.get(activeTab)?.title}
                sx={{
                display: 'flex',
                alignSelf: 'center',
                flexDirection: 'column',
                flexGrow: 1,
                height: '52vh',
                width: boxWidth,
                overflow: 'scroll',
                }}>
                <TextField
                fullWidth
                multiline
                variant="standard"
                value={fieldsMap.get(activeTab)?.value}
                onChange={(event) =>
                    handleTextFieldChange(event, fieldsMap.get(activeTab))
                }
                InputProps={{
                    disableUnderline: true,
                    style: {padding: '10px'},
                }}
                sx={{
                    borderRadius: '3vh',
                    height: '100%',
                    bgcolor: 'white',
                    boxSizing: 'content-box',
                    fontFamily: 'Google Sans, sans-serif',
                    fontSize: '13px',
                    overflow: 'scroll',
                }}
                />
            </Box>
            <Box
                component="div"
                sx={{
                display: 'flex',
                alignSelf: 'center',
                justifyContent: 'space-between',
                width: boxWidth,
                padding: '4vh 2vh 0 2vh',
                boxSizing: 'border-box',
                }}>
                <Button
                className = "shadow-update-button"
                sx={{
                    color: COLORS.grey,
                }}
                onClick={handleCancelButtonClick}>
                Cancel
                </Button>
                <Button
                className = "shadow-update-button"
                sx={{
                    color: COLORS.primary,
                }}
                onClick={handleFinishButtonClick}>
                Finish
                </Button>
            </Box>
            <Box
                component="div"
                sx={{
                display: 'flex',
                justifyContent: 'center',
                alignSelf: 'center',
                width: '35vh',
                paddingTop: '6vh',
                paddingBottom: '8vh',
                boxSizing: 'border-box',
                }}>
                <Typography
                sx={{
                    fontFamily: 'Google Sans, sans-serif',
                    fontSize: '1.5vh',
                    lineHeight: '1.5vh',
                    minHeight: '1em',
                }}>
                Text limitation to more than {wordsLimitation} words.
                </Typography>
            </Box>
            </Box>
        );
        };

        const renderPage = () => {
            switch (activeTab) {
                case optionsTab:
                    return renderOptionsPage();
                default:
                    return renderContextUpdatePage();           
            }
        }

        return (<>{renderPage()}</>);
    }   

export default ConfigPersonality;
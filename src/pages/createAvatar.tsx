import React, {useState, useEffect} from 'react';
import {ArrowBackIosNew} from '@mui/icons-material';
import {Toolbar, IconButton, AppBar, Typography, Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, FormGroup, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import useStyle, {COLORS} from './styles';
import { MaleBitmoji, MaleBitstrips, MaleCm, FemaleBitmoji, FemaleBitstrips, FemaleCm } from '../context/initialAvatar';

const libmoji = require("libmoji");

const GENDER_MAP: Object = {
    "1": "male",
    "2": "female"
}

const STYLE_MAP: Object = {
    "1": "bitstrips",
    "4": "bitmoji",
    "5": "cm"
}

const CreateAvatar: React.FC = () => {
    const [gender, setGender] = useState('1');
    const [style, setStyle] = useState('1');
    const [brand, setBrand] = useState('');
    const [outfit, setOutfit] = useState('');
    const [finalDictionary, setFinalDictionary] = useState(Array<any>);
    const [finalPreviewUrl, setFinalPreviewUrl] = useState('');
    const [traits, setTraits] = useState(Array<any>);

    const {boxWidth} = useStyle();

    const navigate = useNavigate();

    useEffect(() => {
        if (gender && style) {
            setFinalPreviewUrl(generateAvatarPreviewUrl(gender, style, [], ""));
            switch (gender) {
                case "1":
                    switch (style) {
                        case "1":
                            setFinalDictionary(MaleBitstrips);
                            break;
                        case "4":
                            setFinalDictionary(MaleBitmoji);
                            break;
                        case "5":
                            setFinalDictionary(MaleCm);
                            break;
                    }
                break;
                case "2":
                    switch (style) {
                        case "1":
                            setFinalDictionary(FemaleBitstrips);
                            break;
                        case "4":
                            setFinalDictionary(FemaleBitmoji);
                            break;
                        case "5":
                            setFinalDictionary(FemaleCm);
                            break;
                    }
                    break;
            }
        }
        setTraits(updateTraits());
        setBrand("");
        setOutfit("");
        }, [gender, style]);

    useEffect(() => {
        setFinalPreviewUrl(generateAvatarPreviewUrl(gender, style, traits, outfit));
    }, [outfit, traits]);

    const handleBackButtonClick = () => {
        navigate('/');
        return;
    };

    const handleContinueButtonClick = () => {
        navigate('/tools');
        return;
    };

    const handleGenderChange = (event: SelectChangeEvent) => {
        setGender(event.target.value);
        setFinalDictionary([]);
    };

    const handleStyleChange = (event: SelectChangeEvent) => {
        setStyle(event.target.value);
        setFinalDictionary([]);
    };

    const handleBrandChange = (event: SelectChangeEvent) => {
        setBrand(event.target.value);
    };

    const handleOutfitChange = (event: SelectChangeEvent) => {
        setOutfit(event.target.value);
    };

    const handleTraitsChange = (event: any) => {
        let attribute: string = "";
        let value: string = "";
        let raw_event_value = JSON.stringify(event.currentTarget.dataset);
        let event_value = raw_event_value.slice(10, raw_event_value.length - 2);

        let seen: boolean = false;
        let final_dictionary_copy = finalDictionary;

        for (var i = 0; i < event_value.length; i ++) {
            if (event_value[i] == ":") {
                seen = true;
            }

            if (!seen) {
                attribute += event_value[i];
            } else if (seen && event_value[i] != ":") {
                value += event_value[i];
            }
        }

        for (var key in final_dictionary_copy) {
            if (final_dictionary_copy[key]["key"] == attribute) {
                final_dictionary_copy[key]["value"] = parseInt(value);
                break;
            }
        }    

        setFinalDictionary(final_dictionary_copy);
        setTraits(updateTraits());

    };

    const handleSaveAvatar = () => {
        sessionStorage.setItem("avatarImage", finalPreviewUrl);
    };

    const handleImageError = (event: any) => {
        event.target.src = (generateAvatarPreviewUrl(gender,style,[],""));
    };

    const updateTraits = () => {
        let newTraits: Array<any> = [];
        for (var key in finalDictionary) {
            if (finalDictionary[key]["value"] != null) {
                newTraits.push([finalDictionary[key]["key"], finalDictionary[key]["value"]]);
            }
        }
        return newTraits;
    };

    const generateAvatarPreviewUrl = (gender: string, style: string, traits: Array<any>, outfit: string) => {
        let previewUrl = (libmoji.buildPreviewUrl("fashion", 3, parseInt(gender), parseInt(style), 0, traits, outfit));
        return previewUrl;
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
                        Avatar Creation
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    };

    const renderStructurePage = () => {
        return (
            <Box component="div" sx={{display: 'flex', width: boxWidth, flexDirection: 'row', justifyContent: 'space-evenly'}}> 
                <FormControl>
                    <InputLabel>Gender</InputLabel>
                    <Select value={gender} label="Gender" onChange={handleGenderChange}>
                    {libmoji.genders.map((option: any, index: number) => (<MenuItem value={option[1].toString()} key={index}>{option[0]}</MenuItem>))} 
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Style</InputLabel>
                    <Select value={style} label="Style" onChange={handleStyleChange}>
                       {libmoji.styles.map((option: any, index: number) => (<MenuItem value={option[1].toString()} key={index}>{option[0]}</MenuItem>))} 
                    </Select>
                </FormControl>
            </Box>
        );
    };

    const renderOutfitPage = () => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_dict = libmoji.getBrands(selected_gender);
        let brandObject: any;

        for (let key in brands_dict) {
            if (brands_dict[key]["name"] == brand) {
                brandObject = brands_dict[key];
                break;
            }
        }

        let outfitList = [];
        for (var key in brandObject["outfits"]) {
            outfitList.push(brandObject["outfits"][key]["outfit"]);
        }

        return (
            <FormGroup>
                <InputLabel>Outfits</InputLabel>
                <Select value={outfit} label="Outfits" onChange={handleOutfitChange}>
                    {brandObject["outfits"].map((option: any, index: number) => (<MenuItem value={option["id"].toString()} key={index}>{option["outfit"]}</MenuItem>))}
                </Select>
            </FormGroup>
        );
    };

    const renderBrandsPage = () => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_list = libmoji.getBrands(selected_gender);

        return (
            <Box component="div" sx={{display: 'flex', width: '38vh', flexDirection: 'column', justifyContent: 'space-evenly', overflow: 'scroll'}}>
            <FormGroup>
                <InputLabel>Brands</InputLabel>
                <Select value={brand} label="Brands" onChange={handleBrandChange}>
                    {brands_list.map((option: any) => (<MenuItem value={option["name"]} key={option["id"]}>{option["name"]}</MenuItem>))}
                </Select>
            </FormGroup>
            {brand ? (<>{renderOutfitPage()}</>): (<Box component="div" sx={{fontFamily: 'Google Sans, sans-serif'}}><p>You must select a brand before you can pick an outfit.</p></Box>)}
            </Box>
        );
    };

    const renderTraitsPage = () => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const selected_style = STYLE_MAP[style as keyof Object];

        const trait_dict = libmoji.getTraits(selected_gender, selected_style);
        let attributeList: Array<any> = [];
        let value_list: Array<any> = [];

        for (var key in trait_dict) {
            let attribute = [key, trait_dict[key]["key"]];
            attributeList.push(attribute);
            value_list.push(trait_dict[key]["options"]);
        }

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
                {attributeList.map((option: any) => 
                <FormGroup>
                    <InputLabel>{option[1]}</InputLabel>
                    <Select label={option[1]}>
                        {value_list[option[0]].map((value: any, index: number) => (<MenuItem onClick={handleTraitsChange} value={option[1] + ":" + value["value"]} key={index}>{value["value"]}</MenuItem>))}
                    </Select>
                </FormGroup>
                )}
            </Box>         
        );
    };

    const renderAvatarPage = () => {
        return (
            <Box component="div"
                sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: COLORS.bgcolor,
                alignItems: 'center'
                }}>
                {renderAppBar()}
                <Box component="div" sx={{display: 'flex', flexDirection: 'row-reverse', margin: '0 1vh 0 1vh'}}>
                <Box component="div" sx={{margin: '0 0 2vh 2vh', width: boxWidth, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', background: '#FFFFFF', borderRadius: '1.6vh', boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)'}}>
                    <img width="80%" height="80%" src={finalPreviewUrl} onError={handleImageError}/>
                </Box>
                <Box component="div" sx={{padding: '0 2vh 2vh 2vh', margin: '0 2vh 0 0', display: 'flex', justifyContent: 'space-evenly', width: boxWidth, flexDirection: 'column', alignItems: 'center', maxHeight: '70vh', overflow: 'scroll', color: COLORS.primary}}>

                <Box component="div" sx={{padding: '0 0 2vh 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', background: '#FFFFFF', borderRadius: '1.6vh', boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)',}}>
                    <Box component="div">
                        <Typography sx={{ fontFamily: 'Google Sans, sans-serif', margin: '2vh 0 2vh 0'}}>
                            Change Structure
                        </Typography>
                    </Box>
                    {renderStructurePage()} 
                </Box>
                <Box component="div" sx={{padding: '2vh 1vh 2vh 1vh', maxHeight: '20vh', margin: '2vh 0 2vh 0',  background: '#FFFFFF', borderRadius: '1.6vh', boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)'}}>
                <Box component="div" sx={{margin: '0 0 2vh 0', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Typography sx={{fontFamily: 'Google Sans, sans-serif'}}>
                        Change Traits
                    </Typography>
                </Box> 
                {renderTraitsPage()}  
                </Box>
                <Box component="div" sx={{padding: '0 1vh 2vh 1vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', height: '25vh', background: '#FFFFFF', borderRadius: '1.6vh', boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)'}}>
                <Box component="div" sx={{fontFamily: 'Google Sans, sans-serif'}}>
                    <Typography sx={{fontFamily: 'Google Sans, sans-serif'}}>
                        Change Outfit
                    </Typography>
                </Box> 
                {renderBrandsPage()}  
                </Box>  
                </Box>
            </Box>
            <Box component="div" sx={{display: 'flex', alignItems: "center", margin: "2vh 0 0 0"}}>
                <Button className = "shadow-update-button" onClick={() => {handleContinueButtonClick(); handleSaveAvatar()}} sx={{color: COLORS.primary}}>Continue</Button>
            </Box>
        </Box>
        );
    };

    return <>{renderAvatarPage()}</>;
};

export default CreateAvatar;
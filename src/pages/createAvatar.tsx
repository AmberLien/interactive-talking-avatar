import React, {useState, useEffect} from 'react';
import {ArrowBackIosNew} from '@mui/icons-material';
import {Toolbar, IconButton, AppBar, Typography, Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, FormGroup, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import useStyle, {COLORS} from './styles';
import { startRecording } from './webcam';

const libmoji = require("libmoji");

const GENDER_MAP: Object = {
    "1": "male",
    "2": "female"
}

const STYLE_MAP: object = {
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
    const [maleVoice, setMaleVoice] = useState("en-US-Wavenet-A");
    const [femaleVoice, setFemaleVoice] = useState("en-US-Wavenet-C");

    const {boxWidth} = useStyle();

    const navigate = useNavigate();

    useEffect(() => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const selected_style = STYLE_MAP[style as keyof Object];

        let final_dictionary: Array<any> = [];
        const trait_dict = libmoji.getTraits(selected_gender, selected_style);

        for (var key in trait_dict) {
            let attribute = [key, trait_dict[key]["key"]];

            final_dictionary.push({
                key: attribute[1],
                value: null
            });
        }

        setFinalDictionary(final_dictionary);
        setFinalPreviewUrl(generateAvatarPreviewUrl(gender, style, [], ""));
        setTraits(updateTraits());
        setBrand("");
        setOutfit("");
        }, [gender, style]);

    useEffect(() => {
        setFinalPreviewUrl(generateAvatarPreviewUrl(gender, style, traits, outfit));
    }, [outfit, traits]);

    const handleBackButtonClick = () => {
        navigate('/tools');
        return;
    };

    const handleContinueButtonClick = () => {
        sessionStorage.setItem("maleVoice", maleVoice)
        sessionStorage.setItem("femaleVoice", femaleVoice)
        sessionStorage.setItem("selectedGender", gender);
        navigate('/character');
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

    const handleTraitsChange = (event: SelectChangeEvent) => {
        let event_value = event.target.value
        let attribute: string = "";
        let value: string = "";

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
        console.log(finalPreviewUrl)
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
        let previewUrl = (libmoji.buildPreviewUrl("body", 3, parseInt(gender), parseInt(style), 0, traits, outfit));
        return previewUrl;
    };

    const handleMaleVoiceChange = (event: SelectChangeEvent) => {
        setMaleVoice(event.target.value);
    }

    const handleFemaleVoiceChange = (event: SelectChangeEvent) => {
        setFemaleVoice(event.target.value);
    }

    const renderMaleVoiceOptions = () => {
        const voiceOptions = ['en-US-Wavenet-A', 'en-US-Wavenet-B'];
    
        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <FormControl>
                    <InputLabel>Voice</InputLabel>
                    <Select value={maleVoice} label="Voice" onChange={handleMaleVoiceChange}>
                        {voiceOptions.map((value: any, index: number) => <MenuItem key={index} value={value}>{value}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>
        )
    }

    const renderFemaleVoiceOptions = () => {
        const voiceOptions = ['en-US-Wavenet-C'];

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <FormControl>
                    <InputLabel>Voice</InputLabel>
                    <Select value={femaleVoice} label="Voice" onChange={handleFemaleVoiceChange}>
                        {voiceOptions.map((value: any, index: number) => <MenuItem key={index} value={value}>{value}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>
        )
    }

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

    const renderMaleBitstripsPage = () => {
        const trait_dict = libmoji.getTraits("male", "bitstrips");

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
            <FormControl>
                <InputLabel>Beard</InputLabel>
                <Select defaultValue={""} label="Beard" onChange={handleTraitsChange}>
                    {trait_dict[0]["options"].map((value: any, index: number) => (<MenuItem value={"beard:" + value["value"]} key={index}>{"Beard " + (index + 1)}</MenuItem>))}                    
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow</InputLabel>
                <Select defaultValue={""} label="Brow" onChange={handleTraitsChange}>
                {trait_dict[1]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow:" + value["value"]}>{"Brow " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Cheek Details</InputLabel>
                <Select defaultValue={""} label="Cheek Details" onChange={handleTraitsChange}>
                {trait_dict[2]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"cheek_details:" + value["value"]}>{"Cheek Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Ear</InputLabel>
                <Select defaultValue={""} label="Ear" onChange={handleTraitsChange}>
                {trait_dict[3]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"ear:" + value["value"]}>{"Ear " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Earring</InputLabel>
                <Select defaultValue={""} label="Earring" onChange={handleTraitsChange}>
                {trait_dict[4]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"earring:" + value["value"]}>{"Earring " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye</InputLabel>
                <Select defaultValue={""} label="Eye" onChange={handleTraitsChange}>
                {trait_dict[5]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye:" + value["value"]}>{"Eye " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyelash</InputLabel>
                <Select defaultValue={""} label="Eyelash" onChange={handleTraitsChange}>
                {trait_dict[6]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyelash:" + value["value"]}>{"Eyelash " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Details</InputLabel>
                <Select defaultValue={""} label="Eye Details" onChange={handleTraitsChange}>
                {trait_dict[7]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_details:" + value["value"]}>{"Eye Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Lines</InputLabel>
                <Select defaultValue={""} label="Face Lines" onChange={handleTraitsChange}>
                {trait_dict[8]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_lines:" + value["value"]}>{"Face Lines " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Glasses</InputLabel>
                <Select defaultValue={""} label="Glasses" onChange={handleTraitsChange}>
                {trait_dict[9]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"glasses:" + value["value"]}>{"Glasses " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair</InputLabel>
                <Select defaultValue={""} label="Hair" onChange={handleTraitsChange}>
                {trait_dict[10]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair:" + value["value"]}>{"Hair " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hat</InputLabel>
                <Select defaultValue={""} label="Hat" onChange={handleTraitsChange}>
                {trait_dict[11]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hat:" + value["value"]}>{"Hat " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Jaw</InputLabel>
                <Select defaultValue={""} label="Jaw" onChange={handleTraitsChange}>
                {trait_dict[12]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"jaw:" + value["value"]}>{"Jaw " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Mouth</InputLabel>
                <Select defaultValue={""} label="Mouth" onChange={handleTraitsChange}>
                {trait_dict[13]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"mouth:" + value["value"]}>{"Mouth " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Nose</InputLabel>
                <Select defaultValue={""} label="Nose" onChange={handleTraitsChange}>
                {trait_dict[14]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"nose:" + value["value"]}>{"Nose " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil</InputLabel>
                <Select defaultValue={""} label="Pupil" onChange={handleTraitsChange}>
                {trait_dict[15]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil:" + value["value"]}>{"Pupil " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Beard Tone</InputLabel>
                <Select defaultValue={""} label="Beard Tone" onChange={handleTraitsChange}>
                {trait_dict[16]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"beard_tone:" + value["value"]}>{"Beard Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Blush Tone</InputLabel>
                <Select defaultValue={""} label="Blush Tone" onChange={handleTraitsChange}>
                {trait_dict[17]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"blush_tone:" + value["value"]}>{"Blush Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow Tone</InputLabel>
                <Select defaultValue={""} label="Brow Tone" onChange={handleTraitsChange}>
                {trait_dict[18]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow_tone:" + value["value"]}>{"Brow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyeshadow Tone</InputLabel>
                <Select defaultValue={""} label="Eyeshadow Tone" onChange={handleTraitsChange}>
                {trait_dict[19]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyeshadow_tone:" + value["value"]}>{"Eyeshadow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Tone</InputLabel>
                <Select defaultValue={""} label="Hair Tone" onChange={handleTraitsChange}>
                {trait_dict[20]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_tone:" + value["value"]}>{"Hair Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Lipstick Tone</InputLabel>
                <Select defaultValue={""} label="Lipstick Tone" onChange={handleTraitsChange}>
                {trait_dict[21]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"lipstick_tone:" + value["value"]}>{"Lipstick Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil Tone</InputLabel>
                <Select defaultValue={""} label="Pupil Tone" onChange={handleTraitsChange}>
                {trait_dict[22]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil_tone:" + value["value"]}>{"Pupil Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Skin Tone</InputLabel>
                <Select defaultValue={""} label="Skin Tone" onChange={handleTraitsChange}>
                {trait_dict[23]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"skin_tone:" + value["value"]}>{"Skin Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Body</InputLabel>
                <Select defaultValue={""} label="Body" onChange={handleTraitsChange}>
                {trait_dict[24]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"body:" + value["value"]}>{"Body " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Proportion</InputLabel>
                <Select defaultValue={""} label="Face Proportion" onChange={handleTraitsChange}>
                {trait_dict[25]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_proportion:" + value["value"]}>{"Face Proportion " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            </Box>         
        );
    }

    const renderFemaleBitstripsPage = () => {
        const trait_dict = libmoji.getTraits("female", "bitstrips");

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
            <FormControl>
                <InputLabel>Brow</InputLabel>
                <Select defaultValue={""} label="Brow" onChange={handleTraitsChange}>
                    {trait_dict[0]["options"].map((value: any, index: number) => (<MenuItem value={"brow:" + value["value"]} key={index}>{"Brow " + (index + 1)}</MenuItem>))}                    
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Cheek Details</InputLabel>
                <Select defaultValue={""} label="Cheek Details" onChange={handleTraitsChange}>
                {trait_dict[1]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"cheek_details:" + value["value"]}>{"Cheek Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Ear</InputLabel>
                <Select defaultValue={""} label="Ear" onChange={handleTraitsChange}>
                {trait_dict[2]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"ear:" + value["value"]}>{"Ear " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Earring</InputLabel>
                <Select defaultValue={""} label="Earring" onChange={handleTraitsChange}>
                {trait_dict[3]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"earring:" + value["value"]}>{"Earring " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye</InputLabel>
                <Select defaultValue={""} label="Eye" onChange={handleTraitsChange}>
                {trait_dict[4]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye:" + value["value"]}>{"Eye " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyelash</InputLabel>
                <Select defaultValue={""} label="Eyelash" onChange={handleTraitsChange}>
                {trait_dict[5]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyelash:" + value["value"]}>{"Eyelash " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Details</InputLabel>
                <Select defaultValue={""} label="Eye Details" onChange={handleTraitsChange}>
                {trait_dict[6]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_details:" + value["value"]}>{"Eye Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Lines</InputLabel>
                <Select defaultValue={""} label="Face Lines" onChange={handleTraitsChange}>
                {trait_dict[7]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_lines:" + value["value"]}>{"Face Lines " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Glasses</InputLabel>
                <Select defaultValue={""} label="Glasses" onChange={handleTraitsChange}>
                {trait_dict[8]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"glasses:" + value["value"]}>{"Glasses " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair</InputLabel>
                <Select defaultValue={""} label="Hair" onChange={handleTraitsChange}>
                {trait_dict[9]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair:" + value["value"]}>{"Hair " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hat</InputLabel>
                <Select defaultValue={""} label="Hat" onChange={handleTraitsChange}>
                {trait_dict[10]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hat:" + value["value"]}>{"Hat " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Jaw</InputLabel>
                <Select defaultValue={""} label="Jaw" onChange={handleTraitsChange}>
                {trait_dict[11]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"jaw:" + value["value"]}>{"Jaw " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Mouth</InputLabel>
                <Select defaultValue={""} label="Mouth" onChange={handleTraitsChange}>
                {trait_dict[12]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"mouth:" + value["value"]}>{"Mouth " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Nose</InputLabel>
                <Select defaultValue={""} label="Nose" onChange={handleTraitsChange}>
                {trait_dict[13]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"nose:" + value["value"]}>{"Nose " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil</InputLabel>
                <Select defaultValue={""} label="Pupil" onChange={handleTraitsChange}>
                {trait_dict[14]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil:" + value["value"]}>{"Pupil " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Blush Tone</InputLabel>
                <Select defaultValue={""} label="Blush Tone" onChange={handleTraitsChange}>
                {trait_dict[15]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"blush_tone:" + value["value"]}>{"Blush Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow Tone</InputLabel>
                <Select defaultValue={""} label="Brow Tone" onChange={handleTraitsChange}>
                {trait_dict[16]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow_tone:" + value["value"]}>{"Brow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyeshadow Tone</InputLabel>
                <Select defaultValue={""} label="Eyeshadow Tone" onChange={handleTraitsChange}>
                {trait_dict[17]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyeshadow_tone:" + value["value"]}>{"Eyeshadow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Tone</InputLabel>
                <Select defaultValue={""} label="Hair Tone" onChange={handleTraitsChange}>
                {trait_dict[18]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_tone:" + value["value"]}>{"Hair Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Lipstick Tone</InputLabel>
                <Select defaultValue={""} label="Lipstick Tone" onChange={handleTraitsChange}>
                {trait_dict[19]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"lipstick_tone:" + value["value"]}>{"Lipstick Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil Tone</InputLabel>
                <Select defaultValue={""} label="Pupil Tone" onChange={handleTraitsChange}>
                {trait_dict[20]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil_tone:" + value["value"]}>{"Pupil Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Skin Tone</InputLabel>
                <Select defaultValue={""} label="Skin Tone" onChange={handleTraitsChange}>
                {trait_dict[21]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"skin_tone:" + value["value"]}>{"Skin Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Body</InputLabel>
                <Select defaultValue={""} label="Body" onChange={handleTraitsChange}>
                {trait_dict[22]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"body:" + value["value"]}>{"Body " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Breast</InputLabel>
                <Select defaultValue={""} label="Breast" onChange={handleTraitsChange}>
                {trait_dict[23]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"breast:" + value["value"]}>{"Breast " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Proportion</InputLabel>
                <Select defaultValue={""} label="Breast" onChange={handleTraitsChange}>
                {trait_dict[24]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_proportion:" + value["value"]}>{"Face Proportion " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            </Box>         
        );
    }

    const renderMaleBitmojiPage = () => {
        const trait_dict = libmoji.getTraits("male", "bitmoji")

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
            <FormControl>
                <InputLabel>Beard</InputLabel>
                <Select defaultValue={""} label="Beard" onChange={handleTraitsChange}>
                    {trait_dict[0]["options"].map((value: any, index: number) => (<MenuItem value={"beard:" + value["value"]} key={index}>{"Beard " + (index + 1)}</MenuItem>))}                    
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow</InputLabel>
                <Select defaultValue={""} label="Brow" onChange={handleTraitsChange}>
                {trait_dict[1]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow:" + value["value"]}>{"Brow " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Cheek Details</InputLabel>
                <Select defaultValue={""} label="Cheek Details" onChange={handleTraitsChange}>
                {trait_dict[2]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"cheek_details:" + value["value"]}>{"Cheek Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Details</InputLabel>
                <Select defaultValue={""} label="Eye Details" onChange={handleTraitsChange}>
                {trait_dict[3]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_details:" + value["value"]}>{"Eye Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Lines</InputLabel>
                <Select defaultValue={""} label="Face Lines" onChange={handleTraitsChange}>
                {trait_dict[4]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_lines:" + value["value"]}>{"Face Lines " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Glasses</InputLabel>
                <Select defaultValue={""} label="Glasses" onChange={handleTraitsChange}>
                {trait_dict[5]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"glasses:" + value["value"]}>{"Glasses " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair</InputLabel>
                <Select defaultValue={""} label="Hair" onChange={handleTraitsChange}>
                {trait_dict[6]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair:" + value["value"]}>{"Hair " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hat</InputLabel>
                <Select defaultValue={""} label="Hat" onChange={handleTraitsChange}>
                {trait_dict[7]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hat:" + value["value"]}>{"Hat " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Mouth</InputLabel>
                <Select defaultValue={""} label="Mouth" onChange={handleTraitsChange}>
                {trait_dict[8]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"mouth:" + value["value"]}>{"Mouth " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Nose</InputLabel>
                <Select defaultValue={""} label="Nose" onChange={handleTraitsChange}>
                {trait_dict[9]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"nose:" + value["value"]}>{"Nose " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Beard Tone</InputLabel>
                <Select defaultValue={""} label="Beard Tone" onChange={handleTraitsChange}>
                {trait_dict[10]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"beard_tone:" + value["value"]}>{"Beard Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Blush Tone</InputLabel>
                <Select defaultValue={""} label="Blush Tone" onChange={handleTraitsChange}>
                {trait_dict[11]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"blush_tone:" + value["value"]}>{"Blush Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow Tone</InputLabel>
                <Select defaultValue={""} label="Brow Tone" onChange={handleTraitsChange}>
                {trait_dict[12]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow_tone:" + value["value"]}>{"Brow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyeshadow Tone</InputLabel>
                <Select defaultValue={""} label="Eyeshadow Tone" onChange={handleTraitsChange}>
                {trait_dict[13]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyeshadow_tone:" + value["value"]}>{"Eyeshadow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Tone</InputLabel>
                <Select defaultValue={""} label="Hair Tone" onChange={handleTraitsChange}>
                {trait_dict[14]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_tone:" + value["value"]}>{"Hair Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Lipstick Tone</InputLabel>
                <Select defaultValue={""} label="Lipstick Tone" onChange={handleTraitsChange}>
                {trait_dict[15]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"lipstick_tone:" + value["value"]}>{"Lipstick Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil Tone</InputLabel>
                <Select defaultValue={""} label="Pupil Tone" onChange={handleTraitsChange}>
                {trait_dict[16]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil_tone:" + value["value"]}>{"Pupil Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Skin Tone</InputLabel>
                <Select defaultValue={""} label="Skin Tone" onChange={handleTraitsChange}>
                {trait_dict[17]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"skin_tone:" + value["value"]}>{"Skin Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Body</InputLabel>
                <Select defaultValue={""} label="Body" onChange={handleTraitsChange}>
                {trait_dict[18]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"body:" + value["value"]}>{"Body " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Proportion</InputLabel>
                <Select defaultValue={""} label="Face Proportion" onChange={handleTraitsChange}>
                {trait_dict[19]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_proportion:" + value["value"]}>{"Face Proportion " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            </Box>         
        )
    }

    const renderFemaleBitmojiPage = () => {
        const trait_dict = libmoji.getTraits("female", "bitmoji")

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
            <FormControl>
                <InputLabel>Brow</InputLabel>
                <Select defaultValue={""} label="Brow" onChange={handleTraitsChange}>
                {trait_dict[0]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow:" + value["value"]}>{"Brow " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Cheek Details</InputLabel>
                <Select defaultValue={""} label="Cheek Details" onChange={handleTraitsChange}>
                {trait_dict[1]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"cheek_details:" + value["value"]}>{"Cheek Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyelash</InputLabel>
                <Select defaultValue={""} label="Eyelash" onChange={handleTraitsChange}>
                {trait_dict[2]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyelash:" + value["value"]}>{"Eyelash " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Details</InputLabel>
                <Select defaultValue={""} label="Eye Details" onChange={handleTraitsChange}>
                {trait_dict[3]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_details:" + value["value"]}>{"Eye Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Lines</InputLabel>
                <Select defaultValue={""} label="Face Lines" onChange={handleTraitsChange}>
                {trait_dict[4]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_lines:" + value["value"]}>{"Face Lines " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Glasses</InputLabel>
                <Select defaultValue={""} label="Glasses" onChange={handleTraitsChange}>
                {trait_dict[5]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"glasses:" + value["value"]}>{"Glasses " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair</InputLabel>
                <Select defaultValue={""} label="Hair" onChange={handleTraitsChange}>
                {trait_dict[6]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair:" + value["value"]}>{"Hair " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hat</InputLabel>
                <Select defaultValue={""} label="Hat" onChange={handleTraitsChange}>
                {trait_dict[7]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hat:" + value["value"]}>{"Hat " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Mouth</InputLabel>
                <Select defaultValue={""} label="Mouth" onChange={handleTraitsChange}>
                {trait_dict[8]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"mouth:" + value["value"]}>{"Mouth " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Nose</InputLabel>
                <Select defaultValue={""} label="Nose" onChange={handleTraitsChange}>
                {trait_dict[9]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"nose:" + value["value"]}>{"Nose " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Blush Tone</InputLabel>
                <Select defaultValue={""} label="Blush Tone" onChange={handleTraitsChange}>
                {trait_dict[10]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"blush_tone:" + value["value"]}>{"Blush Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow Tone</InputLabel>
                <Select defaultValue={""} label="Brow Tone" onChange={handleTraitsChange}>
                {trait_dict[11]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow_tone:" + value["value"]}>{"Brow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyeshadow Tone</InputLabel>
                <Select defaultValue={""} label="Eyeshadow Tone" onChange={handleTraitsChange}>
                {trait_dict[12]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyeshadow_tone:" + value["value"]}>{"Eyeshadow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Tone</InputLabel>
                <Select defaultValue={""} label="Hair Tone" onChange={handleTraitsChange}>
                {trait_dict[13]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_tone:" + value["value"]}>{"Hair Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Lipstick Tone</InputLabel>
                <Select defaultValue={""} label="Lipstick Tone" onChange={handleTraitsChange}>
                {trait_dict[14]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"lipstick_tone:" + value["value"]}>{"Lipstick Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil Tone</InputLabel>
                <Select defaultValue={""} label="Pupil Tone" onChange={handleTraitsChange}>
                {trait_dict[15]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil_tone:" + value["value"]}>{"Pupil Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Skin Tone</InputLabel>
                <Select defaultValue={""} label="Skin Tone" onChange={handleTraitsChange}>
                {trait_dict[16]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"skin_tone:" + value["value"]}>{"Skin Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Body</InputLabel>
                <Select defaultValue={""} label="Body" onChange={handleTraitsChange}>
                {trait_dict[17]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"body:" + value["value"]}>{"Body " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Breast</InputLabel>
                <Select defaultValue={""} label="Breast" onChange={handleTraitsChange}>
                {trait_dict[18]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"breast:" + value["value"]}>{"Breast " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Proportion</InputLabel>
                <Select defaultValue={""} label="Face Proportion" onChange={handleTraitsChange}>
                {trait_dict[19]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_proportion:" + value["value"]}>{"Face Proportion " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            </Box>         
        );
    }

    const renderMaleCmPage = () => {
        const trait_dict = libmoji.getTraits("male", "cm")

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
            <FormControl>
                <InputLabel>Beard</InputLabel>
                <Select defaultValue={""} label="Beard" onChange={handleTraitsChange}>
                    {trait_dict[0]["options"].map((value: any, index: number) => (<MenuItem value={"beard:" + value["value"]} key={index}>{"Beard " + (index + 1)}</MenuItem>))}                    
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow</InputLabel>
                <Select defaultValue={""} label="Brow" onChange={handleTraitsChange}>
                {trait_dict[1]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow:" + value["value"]}>{"Brow " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Cheek Details</InputLabel>
                <Select defaultValue={""} label="Cheek Details" onChange={handleTraitsChange}>
                {trait_dict[2]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"cheek_details:" + value["value"]}>{"Cheek Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Ear</InputLabel>
                <Select defaultValue={""} label="Ear" onChange={handleTraitsChange}>
                {trait_dict[3]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"ear:" + value["value"]}>{"Ear " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye</InputLabel>
                <Select defaultValue={""} label="Eye" onChange={handleTraitsChange}>
                {trait_dict[4]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye:" + value["value"]}>{"Eye " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyelash</InputLabel>
                <Select defaultValue={""} label="Eyelash" onChange={handleTraitsChange}>
                {trait_dict[5]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyelash:" + value["value"]}>{"Eyelash " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Details</InputLabel>
                <Select defaultValue={""} label="Eye Details" onChange={handleTraitsChange}>
                {trait_dict[6]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_details:" + value["value"]}>{"Eye Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Lines</InputLabel>
                <Select defaultValue={""} label="Face Lines" onChange={handleTraitsChange}>
                {trait_dict[7]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_lines:" + value["value"]}>{"Face Lines " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Glasses</InputLabel>
                <Select defaultValue={""} label="Glasses" onChange={handleTraitsChange}>
                {trait_dict[8]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"glasses:" + value["value"]}>{"Glasses " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair</InputLabel>
                <Select defaultValue={""} label="Hair" onChange={handleTraitsChange}>
                {trait_dict[9]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair:" + value["value"]}>{"Hair " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hat</InputLabel>
                <Select defaultValue={""} label="Hat" onChange={handleTraitsChange}>
                {trait_dict[10]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hat:" + value["value"]}>{"Hat " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Jaw</InputLabel>
                <Select defaultValue={""} label="Jaw" onChange={handleTraitsChange}>
                {trait_dict[11]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"jaw:" + value["value"]}>{"Jaw " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Mouth</InputLabel>
                <Select defaultValue={""} label="Mouth" onChange={handleTraitsChange}>
                {trait_dict[12]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"mouth:" + value["value"]}>{"Mouth " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Nose</InputLabel>
                <Select defaultValue={""} label="Nose" onChange={handleTraitsChange}>
                {trait_dict[13]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"nose:" + value["value"]}>{"Nose " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Beard Tone</InputLabel>
                <Select defaultValue={""} label="Beard Tone" onChange={handleTraitsChange}>
                {trait_dict[14]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"beard_tone:" + value["value"]}>{"Beard Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Blush Tone</InputLabel>
                <Select defaultValue={""} label="Blush Tone" onChange={handleTraitsChange}>
                {trait_dict[15]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"blush_tone:" + value["value"]}>{"Blush Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow Tone</InputLabel>
                <Select defaultValue={""} label="Brow Tone" onChange={handleTraitsChange}>
                {trait_dict[16]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow_tone:" + value["value"]}>{"Brow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyeshadow Tone</InputLabel>
                <Select defaultValue={""} label="Eyeshadow Tone" onChange={handleTraitsChange}>
                {trait_dict[17]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyeshadow_tone:" + value["value"]}>{"Eyeshadow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Tone</InputLabel>
                <Select defaultValue={""} label="Hair Tone" onChange={handleTraitsChange}>
                {trait_dict[18]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_tone:" + value["value"]}>{"Hair Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Treatment Tone</InputLabel>
                <Select defaultValue={""} label="Hair Treatment Tone" onChange={handleTraitsChange}>
                {trait_dict[19]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_treatment_tone:" + value["value"]}>{"Hair Treatment Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Lipstick Tone</InputLabel>
                <Select defaultValue={""} label="Lipstick Tone" onChange={handleTraitsChange}>
                {trait_dict[20]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"lipstick_tone:" + value["value"]}>{"Lipstick Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil Tone</InputLabel>
                <Select defaultValue={""} label="Pupil Tone" onChange={handleTraitsChange}>
                {trait_dict[21]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil_tone:" + value["value"]}>{"Pupil Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Skin Tone</InputLabel>
                <Select defaultValue={""} label="Skin Tone" onChange={handleTraitsChange}>
                {trait_dict[22]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"skin_tone:" + value["value"]}>{"Skin Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Body</InputLabel>
                <Select defaultValue={""} label="Body" onChange={handleTraitsChange}>
                {trait_dict[23]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"body:" + value["value"]}>{"Body " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Proportion</InputLabel>
                <Select defaultValue={""} label="Face Proportion" onChange={handleTraitsChange}>
                {trait_dict[24]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_proportion:" + value["value"]}>{"Face Proportion " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Spacing</InputLabel>
                <Select defaultValue={""} label="Eye Spacing" onChange={handleTraitsChange}>
                {trait_dict[25]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_spacing:" + value["value"]}>{"Eye Spacing " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Size</InputLabel>
                <Select defaultValue={""} label="Eye Size" onChange={handleTraitsChange}>
                {trait_dict[26]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_size:" + value["value"]}>{"Eye Size " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            </Box>         
        );
    }

    const renderFemaleCmPage = () => {
        const trait_dict = libmoji.getTraits("female", "cm")

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
            <FormControl>
                <InputLabel>Brow</InputLabel>
                <Select defaultValue={""} label="Brow" onChange={handleTraitsChange}>
                {trait_dict[0]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow:" + value["value"]}>{"Brow " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Cheek Details</InputLabel>
                <Select defaultValue={""} label="Cheek Details" onChange={handleTraitsChange}>
                {trait_dict[1]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"cheek_details:" + value["value"]}>{"Cheek Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Ear</InputLabel>
                <Select defaultValue={""} label="Ear" onChange={handleTraitsChange}>
                {trait_dict[2]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"ear:" + value["value"]}>{"Ear " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye</InputLabel>
                <Select defaultValue={""} label="Eye" onChange={handleTraitsChange}>
                {trait_dict[3]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye:" + value["value"]}>{"Eye " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyelash</InputLabel>
                <Select defaultValue={""} label="Eyelash" onChange={handleTraitsChange}>
                {trait_dict[4]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyelash:" + value["value"]}>{"Eyelash " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Details</InputLabel>
                <Select defaultValue={""} label="Eye Details" onChange={handleTraitsChange}>
                {trait_dict[5]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_details:" + value["value"]}>{"Eye Details " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Lines</InputLabel>
                <Select defaultValue={""} label="Face Lines" onChange={handleTraitsChange}>
                {trait_dict[6]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_lines:" + value["value"]}>{"Face Lines " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Glasses</InputLabel>
                <Select defaultValue={""} label="Glasses" onChange={handleTraitsChange}>
                {trait_dict[7]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"glasses:" + value["value"]}>{"Glasses " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair</InputLabel>
                <Select defaultValue={""} label="Hair" onChange={handleTraitsChange}>
                {trait_dict[8]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair:" + value["value"]}>{"Hair " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hat</InputLabel>
                <Select defaultValue={""} label="Hat" onChange={handleTraitsChange}>
                {trait_dict[9]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hat:" + value["value"]}>{"Hat " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Jaw</InputLabel>
                <Select defaultValue={""} label="Jaw" onChange={handleTraitsChange}>
                {trait_dict[10]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"jaw:" + value["value"]}>{"Jaw " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Mouth</InputLabel>
                <Select defaultValue={""} label="Mouth" onChange={handleTraitsChange}>
                {trait_dict[11]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"mouth:" + value["value"]}>{"Mouth " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Nose</InputLabel>
                <Select defaultValue={""} label="Nose" onChange={handleTraitsChange}>
                {trait_dict[12]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"nose:" + value["value"]}>{"Nose " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Blush Tone</InputLabel>
                <Select defaultValue={""} label="Blush Tone" onChange={handleTraitsChange}>
                {trait_dict[13]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"blush_tone:" + value["value"]}>{"Blush Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Brow Tone</InputLabel>
                <Select defaultValue={""} label="Brow Tone" onChange={handleTraitsChange}>
                {trait_dict[14]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"brow_tone:" + value["value"]}>{"Brow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eyeshadow Tone</InputLabel>
                <Select defaultValue={""} label="Eyeshadow Tone" onChange={handleTraitsChange}>
                {trait_dict[15]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eyeshadow_tone:" + value["value"]}>{"Eyeshadow Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Tone</InputLabel>
                <Select defaultValue={""} label="Hair Tone" onChange={handleTraitsChange}>
                {trait_dict[16]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_tone:" + value["value"]}>{"Hair Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Hair Treatment Tone</InputLabel>
                <Select defaultValue={""} label="Hair Treatment Tone" onChange={handleTraitsChange}>
                {trait_dict[17]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"hair_treatment_tone:" + value["value"]}>{"Hair Treatment Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Lipstick Tone</InputLabel>
                <Select defaultValue={""} label="Lipstick Tone" onChange={handleTraitsChange}>
                {trait_dict[18]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"lipstick_tone:" + value["value"]}>{"Lipstick Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pupil Tone</InputLabel>
                <Select defaultValue={""} label="Pupil Tone" onChange={handleTraitsChange}>
                {trait_dict[19]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"pupil_tone:" + value["value"]}>{"Pupil Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Skin Tone</InputLabel>
                <Select defaultValue={""} label="Skin Tone" onChange={handleTraitsChange}>
                {trait_dict[20]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"skin_tone:" + value["value"]}>{"Skin Tone " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Body</InputLabel>
                <Select defaultValue={""} label="Body" onChange={handleTraitsChange}>
                {trait_dict[21]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"body:" + value["value"]}>{"Body " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Breast</InputLabel>
                <Select defaultValue={""} label="Breast" onChange={handleTraitsChange}>
                {trait_dict[22]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"breast:" + value["value"]}>{"Breast " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Face Proportion</InputLabel>
                <Select defaultValue={""} label="Face Proportion" onChange={handleTraitsChange}>
                {trait_dict[23]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"face_proportion:" + value["value"]}>{"Face Proportion " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Spacing</InputLabel>
                <Select defaultValue={""} label="Eye Spacing" onChange={handleTraitsChange}>
                {trait_dict[24]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_spacing:" + value["value"]}>{"Eye Spacing " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Eye Size</InputLabel>
                <Select defaultValue={""} label="Eye Size" onChange={handleTraitsChange}>
                {trait_dict[25]["options"].map((value: any, index: number) => (<MenuItem key={index} value={"eye_size:" + value["value"]}>{"Eye Size " + (index + 1)}</MenuItem>))}
                </Select>
            </FormControl>
            </Box>         
        );
    }

    const renderSelectedTraitsPage = () => {
        switch (gender) {
            case "1":
                switch (style) {
                    case "1":
                        return <>{renderMaleBitstripsPage()}</>
                    case "4":
                        return <>{renderMaleBitmojiPage()}</>
                    case "5":
                        return <>{renderMaleCmPage()}</>
                }
                break;
            case "2":
                switch (style) {
                    case "1":
                        return <>{renderFemaleBitstripsPage()}</>
                    case "4":
                        return <>{renderFemaleBitmojiPage()}</>
                    case "5":
                        return <>{renderFemaleCmPage()}</>
                }
        }
    }

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
                <Box component="div" sx={{margin: '0 0 2vh 2vh', width: boxWidth, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', background: '#FFFFFF', borderRadius: '1.6vh', boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)'}}>
                    <img width="80%" height="80%" src={finalPreviewUrl} onError={handleImageError}/>
                    {(gender == "1") ? <>{renderMaleVoiceOptions()}</> : <>{renderFemaleVoiceOptions()}</>}
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
                {renderSelectedTraitsPage()}  
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
                <Button className = "shadow-update-button" onClick={() => {handleContinueButtonClick(); handleSaveAvatar(); startRecording()}} sx={{color: COLORS.primary}}>Continue</Button>
            </Box>
        </Box>
        );
    };

    return <>{renderAvatarPage()}</>;
};

export default CreateAvatar;
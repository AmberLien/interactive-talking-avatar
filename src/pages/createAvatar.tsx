import React, {useState, useEffect} from 'react';
import {ArrowBackIosNew} from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {Toolbar, IconButton, AppBar, Typography, Box, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, FormGroup, Button} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
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
        navigate('/configPersonality');
        return;
    };

    const handleContinueButtonClick = () => {
        sessionStorage.setItem("maleVoice", maleVoice)
        sessionStorage.setItem("femaleVoice", femaleVoice)
        sessionStorage.setItem("selectedGender", gender);
        sessionStorage.setItem("selectedStyle", style)
        navigate('/character');
        return;
    };

    // handles structure change
    const handleGenderChange = (event: any) => {
        setGender((event+1).toString())
        setFinalDictionary([]);
    };

    const handleStyleChange = (event: any) => {
        switch (event) {
            case 0:
                setStyle('1');
                break
            case 1:
                setStyle('4');
                break
            case 2:
                setStyle('5');
        } 
        setFinalDictionary([]);
    };

    const handleBrandChange = (event: any) => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_list = libmoji.getBrands(selected_gender);
        setBrand(brands_list[event]["name"]);
    };
    
    const handleOutfitChange = (event: any) => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_dict = libmoji.getBrands(selected_gender);
        let brandObject: any;

        for (let key in brands_dict) {
            if (brands_dict[key]["name"] == brand) {
                brandObject = brands_dict[key];
                break;
            }
        }

        setOutfit(brandObject["outfits"][event]["id"]);
    };

    // helper function that stores the avatar's url and displays it in the console
    const handleSaveAvatar = () => {
        sessionStorage.setItem("avatarImage", finalPreviewUrl);
        console.log(finalPreviewUrl)
    };

    const handleImageError = (event: any) => {
        event.target.src = (generateAvatarPreviewUrl(gender,style,[],""));
    };

    // helper function to update avatar's traits
    const updateTraits = () => {
        let newTraits: Array<any> = [];
        for (var key in finalDictionary) {
            if (finalDictionary[key]["value"] != null) {
                newTraits.push([finalDictionary[key]["key"], finalDictionary[key]["value"]]);
            }
        }
        return newTraits;
    };

    // helper function that generates the avatar's url
    const generateAvatarPreviewUrl = (gender: string, style: string, traits: Array<any>, outfit: string) => {
        let previewUrl = (libmoji.buildPreviewUrl("body", 3, parseInt(gender), parseInt(style), 0, traits, outfit));
        return previewUrl;
    };

    // handles voice selection
    const handleMaleVoiceChange = (event: any) => {
        const voiceOptions = ['en-US-Wavenet-A', 'en-US-Wavenet-B'];
        setMaleVoice(voiceOptions[event])
    }

    const handleFemaleVoiceChange = (event: any) => {
        const voiceOptions = ['en-US-Wavenet-C'];
        setFemaleVoice(voiceOptions[event])
    }

    const renderMaleVoiceOptions = () => {
        const voiceOptions = ['en-US-Wavenet-A', 'en-US-Wavenet-B'];
    
        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'row', width: boxWidth, justifyContent: 'space-evenly', fontFamily: 'Google Sans, sans-serif', color: COLORS.primary}}>
                <Carousel onChange={handleMaleVoiceChange} navButtonsAlwaysVisible={true} sx={{width: .8}}>
                    {voiceOptions.map((value: any, index: number) => <MenuItem sx={{display: 'flex', justifyContent: 'space-evenly'}} key={index} value={value}>{value}</MenuItem>)}
                </Carousel>
            </Box>
        )
    }

    const renderFemaleVoiceOptions = () => {
        const voiceOptions = ['en-US-Wavenet-C'];

        return (
            <Box component="div" sx={{display: 'flex', width: boxWidth, flexDirection: 'row', justifyContent: 'space-evenly', fontFamily: 'Google Sans, sans-serif', color: COLORS.primary}}>
                <Carousel onChange={handleFemaleVoiceChange} navButtonsAlwaysVisible={true} sx={{width: .8}}>
                    {voiceOptions.map((value: any, index: number) => <MenuItem sx={{display: 'flex', justifyContent: 'space-evenly'}} key={index} value={value}>{value}</MenuItem>)}
                </Carousel>
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
                <Carousel autoPlay={false} navButtonsAlwaysVisible={true} onChange={handleGenderChange} NextIcon={<NavigateNextIcon sx={{fontSize: 'medium'}} />} PrevIcon={<NavigateBeforeIcon sx={{fontSize: 'medium'}} />} sx={{width: .5, }}>
                    {
                        libmoji.genders.map((option: any, index: number) => (<MenuItem sx={{margin: '0 0 1vh 0', display: 'flex', justifyContent: 'space-evenly'}} key={index} value={option[1]}>{option[0]}</MenuItem>))
                    }
                </Carousel>                
                <Carousel autoPlay={false} navButtonsAlwaysVisible={true} onChange={handleStyleChange} NextIcon={<NavigateNextIcon sx={{fontSize: 'medium'}} />} PrevIcon={<NavigateBeforeIcon sx={{fontSize: 'medium'}} />} sx={{width: .5}}>
                    {
                        libmoji.styles.map((option: any, index: number) => (<MenuItem sx={{margin: '0 0 1vh 0', display: 'flex', justifyContent: 'space-evenly'}} key={index} value={option[1]}>{option[0]}</MenuItem>))
                    }
                </Carousel>
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

        return (
            <Carousel autoPlay={false} navButtonsAlwaysVisible={true} onChange={handleOutfitChange} NextIcon={<NavigateNextIcon sx={{fontSize: 'medium'}} />} PrevIcon={<NavigateBeforeIcon sx={{fontSize: 'medium'}} />} sx={{width: 1}}>
                    {
                        brandObject["outfits"].map((option: any, index: number) => (<MenuItem sx={{ display: 'flex', justifyContent: 'space-evenly'}} key={index} value={option["id"].toString()}>{option["outfit"]}</MenuItem>))
                    }
            </Carousel>
        );
    };

    const renderBrandsPage = () => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_list = libmoji.getBrands(selected_gender);

        return (
            <Box component="div" sx={{display: 'flex', width: '38vh', flexDirection: 'column', justifyContent: 'space-evenly', overflow: 'scroll'}}>
                <Carousel autoPlay={false} navButtonsAlwaysVisible={true} onChange={handleBrandChange} NextIcon={<NavigateNextIcon sx={{fontSize: 'medium'}} />} PrevIcon={<NavigateBeforeIcon sx={{fontSize: 'medium'}} />} sx={{width: 1}}>
                    {
                        brands_list.map((option: any) => (<MenuItem key={option["id"]} sx={{display: 'flex', justifyContent: 'space-evenly'}} value={option["name"]}>{option["name"]}</MenuItem>))
                    }
                </Carousel>
                {brand ? (<>{renderOutfitPage()}</>): (<Box component="div" sx={{fontFamily: 'Google Sans, sans-serif'}}><p>You must select a brand before you can pick an outfit.</p></Box>)}
            </Box>
            
        );
    };

    // helper function to determine key of physical trait
    const determineKey = (name: string): number => {

        for (var key in finalDictionary) {
            if (finalDictionary[key]["key"] == name) {
                return parseInt(key);
            }
        }

        return 0;
    };

    // functions to handle trait changes
    const handleBeardChange = (event: any) => {
        const trait_dict = libmoji.getTraits("male", STYLE_MAP[style as keyof Object]);

        let key: number = determineKey('beard');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];
           
        setTraits(updateTraits());
    };

    const handleBrowChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('brow');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleCheekDetailsChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('cheek_details');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEarChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('ear');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEarringChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('earring');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEyeChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('eye');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEyelashChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('eyelash');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEyeDetailsChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('eye_details');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleFaceLinesChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('face_lines');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };
    
    const handleGlassesChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('glasses');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleHatChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('hat');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleNoseChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('nose');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleHairChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('hair');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleJawChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('jaw');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleBlushToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('blush_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleMouthChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('mouth');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleBeardToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('beard_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleBrowToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('brow_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleLipstickToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('lipstick_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handlePupilChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('pupil');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEyeshadowToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('eyeshadow_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleHairToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('hair_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleBodyChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('body');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handlePupilToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('pupil_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleFaceProportionsChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        let key: number = determineKey('face_proportion');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleSkinToneChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('skin_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleBreastChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('breast');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleHairTreatmentTone = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('hair_treatment_tone');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEyeSpacingChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('eye_spacing');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    const handleEyeSizeChange = (event: any) => {
        const trait_dict = libmoji.getTraits(GENDER_MAP[gender as keyof Object], STYLE_MAP[style as keyof Object]);
        
        let key: number = determineKey('eye_size');
        finalDictionary[key]["value"] = trait_dict[key]["options"][event]["value"];

        setTraits(updateTraits());
    };

    // returns the template for the traits selection
    const renderTraitsPage = (trait_dict: any, change_list: any, name_list: any) => {
        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: '38vh', maxHeight: .8}}>
                {change_list.map((options: any, index: number) => (<Box component="div" sx={{height: '40px'}} key={index}>
                    <Carousel indicators={false} sx={{width: 1, height: 1, margin: '0 0 1vh 0'}} autoPlay={false} navButtonsAlwaysVisible={true} onChange={options} NextIcon={<NavigateNextIcon sx={{fontSize: 'medium'}}/>} PrevIcon={<NavigateBeforeIcon sx={{fontSize: 'medium'}} key={index}/>}>
                    {
                    trait_dict[index]["options"].map((value: any, id: number) => (<MenuItem sx={{display: 'flex', justifyContent: 'space-evenly', height: .15}} key={id} value={value["value"]}>{name_list[index] + " " + (id + 1)}</MenuItem>))
                    }
                    </Carousel>
                </Box>))}
            </Box>
        )
    };
    
    const renderMaleBitstripsPage = () => {
        const trait_dict = libmoji.getTraits("male", "bitstrips");
        const change_list = [handleBeardChange, handleBrowChange, handleCheekDetailsChange, handleEarChange, handleEarringChange, handleEyeChange, handleEyelashChange, handleEyeDetailsChange, handleFaceLinesChange, handleGlassesChange, handleHairChange, handleHatChange, handleJawChange, handleMouthChange, handleNoseChange, handlePupilChange, handleBeardToneChange, handleBlushToneChange, handleBrowToneChange, handleEyeshadowToneChange, handleHairToneChange, handleLipstickToneChange, handlePupilToneChange, handleSkinToneChange, handleBodyChange, handleFaceProportionsChange];
        const name_list = ["Beard", "Brow", "Cheek Details", "Ear", "Earring", "Eye", "Eyelash", "Eye Details", "Face Lines", "Glasses", "Hair", "Hat", "Jaw", "Mouth", "Nose", "Pupil", "Beard Tone", "Blush Tone", "Brow Tone", "Eyeshadow Tone", "Hair Tone", "Lipstick Tone", "Pupil Tone", "Skin Tone", "Body", "Face Proportions"];
        
        return <>{renderTraitsPage(trait_dict, change_list, name_list)}</>;
    };

    const renderFemaleBitstripsPage = () => {
        const trait_dict = libmoji.getTraits("female", "bitstrips");
        const change_list = [handleBrowChange, handleCheekDetailsChange, handleEarChange, handleEarringChange, handleEyeChange, handleEyelashChange, handleEyeDetailsChange, handleFaceLinesChange, handleGlassesChange, handleHairChange, handleHatChange, handleJawChange, handleMouthChange, handleNoseChange, handlePupilChange, handleBlushToneChange, handleBrowToneChange, handleEyeshadowToneChange, handleHairToneChange, handleLipstickToneChange, handlePupilToneChange, handleSkinToneChange, handleBodyChange, handleBreastChange, handleFaceProportionsChange];
        const name_list = ["Brow", "Cheek Details", "Ear", "Earring", "Eye", "Eyelash", "Eye Details", "Face Lines", "Glasses", "Hair", "Hat", "Jaw", "Mouth", "Nose", "Pupil", "Blush Tone", "Brow Tone", "Eyeshadow Tone", "Hair Tone", "Lipstick Tone", "Pupil Tone", "Skin Tone", "Body", "Breast", "Face Proportions"];

        return <>{renderTraitsPage(trait_dict, change_list, name_list)}</>;
    };

    const renderMaleBitmojiPage = () => {
        const trait_dict = libmoji.getTraits("male", "bitmoji");
        const change_list = [handleBeardChange, handleBrowChange, handleCheekDetailsChange, handleEyeDetailsChange, handleFaceLinesChange, handleGlassesChange, handleHairChange, handleHatChange, handleMouthChange, handleNoseChange, handleBeardToneChange, handleBlushToneChange, handleBrowToneChange, handleEyeshadowToneChange, handleHairToneChange, handleLipstickToneChange, handlePupilToneChange, handleSkinToneChange, handleBodyChange, handleFaceProportionsChange];
        const name_list = ["Beard", "Brow", "Cheek Details", "Eye Details", "Face Lines", "Glasses", "Hair", "Hat", "Mouth", "Nose", "Beard Tone", "Blush Tone", "Brow Tone", "Eyeshadow Tone", "Hair Tone", "Lipstick Tone", "Pupil Tone", "Skin Tone", "Body", "Face Proportions"];

        return <>{renderTraitsPage(trait_dict, change_list, name_list)}</>;
    };

    const renderFemaleBitmojiPage = () => {
        const trait_dict = libmoji.getTraits("female", "bitmoji");
        const change_list = [handleBrowChange, handleCheekDetailsChange, handleEyelashChange, handleEyeDetailsChange, handleFaceLinesChange, handleGlassesChange, handleHairChange, handleHatChange, handleMouthChange, handleNoseChange, handleBlushToneChange, handleBrowToneChange, handleEyeshadowToneChange, handleHairToneChange, handleLipstickToneChange, handlePupilToneChange, handleSkinToneChange, handleBodyChange, handleBreastChange, handleFaceProportionsChange];
        const name_list = ["Brow", "Cheek Details", "Eyelash", "Eye Details", "Face Lines", "Glasses", "Hair", "Hat", "Mouth", "Nose", "Blush Tone", "Brow Tone", "Eyeshadow Tone", "Hair Tone", "Lipstick Tone", "Pupil Tone", "Skin Tone", "Body", "Breast", "Face Proportions"];

        return <>{renderTraitsPage(trait_dict, change_list, name_list)}</>;
    };

    const renderMaleCmPage = () => {
        const trait_dict = libmoji.getTraits("male", "cm");
        const change_list = [handleBeardChange, handleBrowChange, handleCheekDetailsChange, handleEarChange, handleEyeChange, handleEyelashChange, handleEyeDetailsChange, handleFaceLinesChange, handleGlassesChange, handleHairChange, handleHatChange, handleJawChange, handleMouthChange, handleNoseChange, handleBeardToneChange, handleBlushToneChange, handleBrowToneChange, handleEyeshadowToneChange, handleHairToneChange, handleHairTreatmentTone, handleLipstickToneChange, handlePupilToneChange, handleSkinToneChange, handleBodyChange, handleFaceProportionsChange, handleEyeSpacingChange, handleEyeSizeChange];
        const name_list = ["Beard", "Brow", "Cheek Details", "Ear", "Eye", "Eyelash", "Eye Details", "Face Lines", "Glasses", "Hair", "Hat", "Jaw", "Mouth", "Nose", "Beard Tone", "Blush Tone", "Brow Tone", "Eyeshadow Tone", "Hair Tone", "Hair Treatment", "Lipstick Tone", "Pupil Tone", "Skin Tone", "Body", "Face Proportions", "Eye Spacing", "Eye Size"];
        
        return <>{renderTraitsPage(trait_dict, change_list, name_list)}</>;
    };

    const renderFemaleCmPage = () => {
        const trait_dict = libmoji.getTraits("female", "cm");
        const change_list = [handleBrowChange, handleCheekDetailsChange, handleEarChange, handleEyeChange, handleEyelashChange, handleEyeDetailsChange, handleFaceLinesChange, handleGlassesChange, handleHairChange, handleHatChange, handleJawChange, handleMouthChange, handleNoseChange, handleBlushToneChange, handleBrowToneChange, handleEyeshadowToneChange, handleHairToneChange, handleHairTreatmentTone, handleLipstickToneChange, handlePupilToneChange, handleSkinToneChange, handleBodyChange, handleBreastChange, handleFaceProportionsChange, handleEyeSpacingChange, handleEyeSizeChange];
        const name_list = ["Brow", "Cheek Details", "Ear", "Eye", "Eyelash", "Eye Details", "Face Lines", "Glasses", "Hair", "Hat", "Jaw", "Mouth", "Nose", "Blush Tone", "Brow Tone", "Eyeshadow Tone", "Hair Tone", "Hair Treatment", "Lipstick Tone", "Pupil Tone", "Skin Tone", "Body", "Breast", "Face Proportions", "Eye Spacing", "Eye Size"];

        return  <>{renderTraitsPage(trait_dict, change_list, name_list)}</>;
    };
    
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
                <Box component="div" sx={{margin: '0 0 2vh 2vh', width: boxWidth, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', background: '#FFFFFF', borderRadius: '1.6vh', boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)'}}>
                    <img width="80%" height="80%" src={finalPreviewUrl} onError={handleImageError}/>
                    {(sessionStorage.getItem('useGoogleApi') == 'true') ? ((gender == "1") ? <>{renderMaleVoiceOptions()}</> : <>{renderFemaleVoiceOptions()}</>) : <></>}
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
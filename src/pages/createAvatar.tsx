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
    const [finalPreviewUrl, setFinalPreviewUrl] = useState('')
    const [traits, setTraits] = useState(Array<any>);

    const changeStructureTab = 'changeStructure';
    const changeTraitsTab = 'changeTraits';
    const changeBrandTab = 'changeBrand';

    const {boxWidth} = useStyle();

    const navigate = useNavigate();

    interface SettingField {
        key: string;
        title: string;
        tabName: string;
      }

    const [activeTab, setActiveTab] = useState(changeStructureTab);

    const fieldsMap = new Map<string, SettingField>([
        [
          changeStructureTab,
          {
            key: changeStructureTab,
            title: 'Structure',
            tabName: 'Change Structure',
          },
        ],
        [
          changeTraitsTab,
          {
            key: changeTraitsTab,
            title: 'Traits',
            tabName: 'Change Traits',
          },
        ],
        [
          changeBrandTab,
          {
            key: changeBrandTab,
            title: 'Brand',
            tabName: 'Change Brand',
          },
        ],
      ]);

    useEffect(() => {
        if (gender && style) {
            setFinalPreviewUrl(generateAvatarPreviewUrl(gender, style, [], ""))
            switch (gender) {
                case "1":
                    switch (style) {
                        case "1":
                            setFinalDictionary(MaleBitstrips);
                            break;
                        case "4":
                            setFinalDictionary(MaleBitmoji)
                            break
                        case "5":
                            setFinalDictionary(MaleCm)
                            break
                    }
                break
                case "2":
                    switch (style) {
                        case "1":
                            setFinalDictionary(FemaleBitstrips);
                            break;
                        case "4":
                            setFinalDictionary(FemaleBitmoji)
                            break
                        case "5":
                            setFinalDictionary(FemaleCm)
                            break
                    }
                    break
            }
        }
        // setTraits(updateTraits())
        // setBrand("")
        // setOutfit("")
        }, [gender, style])

    useEffect(() => {
        // console.log('something has changed')
        // console.log('brand: ' + brand)
        // console.log('outfit: ' + outfit)
        // console.log('traits: ' + traits)
        // console.log('gender: ' + gender)
        // console.log('style: ' + style)
        setFinalPreviewUrl(generateAvatarPreviewUrl(gender, style, traits, outfit))
    }, [outfit, traits, gender, style])

    const handleBackButtonClick = () => {
        navigate('/');
        return;
    };

    const handleGenderChange = (event: SelectChangeEvent) => {
        setGender(event.target.value)
        setFinalDictionary([]);
    }

    const handleStyleChange = (event: SelectChangeEvent) => {
        setStyle(event.target.value)
        setFinalDictionary([]);
    }

    const handleBrandChange = (event: SelectChangeEvent) => {
        setBrand(event.target.value)
    }

    const handleOutfitChange = (event: SelectChangeEvent) => {
        setOutfit(event.target.value)
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

    const handleContinueButtonClick = () => {
        navigate('/tools')
    }

    const handleTraitsChange = (event: any) => {
        let attribute: string = ""
        let value: string = ""
        let raw_event_value = JSON.stringify(event.currentTarget.dataset)
        let event_value = raw_event_value.slice(10, raw_event_value.length - 2)

        let seen: boolean = false
        let final_dictionary_copy = finalDictionary

        for (var i = 0; i < event_value.length; i ++) {
            if (event_value[i] == ":") {
                seen = true
            }

            if (!seen) {
                attribute += event_value[i]
            } else if (seen && event_value[i] != ":") {
                value += event_value[i]
            }
        }

        for (var key in final_dictionary_copy) {
            if (final_dictionary_copy[key]["key"] == attribute) {
                final_dictionary_copy[key]["value"] = parseInt(value)
                break
            }
        }
        
        setFinalDictionary(final_dictionary_copy)
        setTraits(updateTraits())
    }

    const updateTraits = () => {
        let newTraits: Array<any> = [];
        for (var key in finalDictionary) {
            if (finalDictionary[key]["value"] != null) {
                newTraits.push([finalDictionary[key]["key"], finalDictionary[key]["value"]])
            }
        }
        return newTraits
    }

    const generateAvatarPreviewUrl = (gender: string, style: string, traits: Array<any>, outfit: string) => {

        let previewUrl = (libmoji.buildPreviewUrl("fashion", 3, parseInt(gender), parseInt(style), 0, traits, outfit))
        return (previewUrl)
    }

    const handleSaveAvatar = () => {
        sessionStorage.setItem("avatarImage", finalPreviewUrl)
    }

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
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
    }

    const handleImageError = (event: any) => {
        event.target.src = (generateAvatarPreviewUrl(gender,style,[],""))
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
                <Box component="div" sx={{width: boxWidth, display: 'flex', justifyContent: 'space-evenly'}}>
                    <img width="40%" height="40%" src={finalPreviewUrl} onError={handleImageError}/>
                </Box>
                <Box component="div" sx={{display: 'flex', justifyContent: 'space-evenly', width: boxWidth}}>
                {[...fieldsMap.entries()].map(([key, value]) => (
                <Box
                    component="div"
                    key={key}
                    sx={{
                    display: 'flex',
                    alignSelf: 'center',
                    alignItems: 'center',
                    width: .3,
                    height: '6vh',
                    boxSizing: 'content-box',
                    borderRadius: '1.6vh',
                    boxShadow: '1vh 1vh 1vh 0.1vh rgba(0,0,0,0.2)',
                    overflow: 'hidden',
                    margin: '2vh 0 4vh 0',
                    bgcolor: '#FFFFFF',
                    justifyContent: 'space-evenly'
                    }}
                    >
                    <Button sx={{fontFamily: 'Google Sans, sans-serif', width: .2}} onClick={() => handleTabClick(key)}>
                        {value.tabName}
                    </Button>
                </Box>
                ))}
            </Box>
            {renderPage()}
            <Box component="div" sx={{display: 'flex', alignItems: "center", margin: "2vh 0 0 0"}}>
                <Button className = "shadow-update-button" onClick={() => {handleContinueButtonClick(); handleSaveAvatar()}} sx={{color: COLORS.primary}}>Continue</Button>
            </Box>
        </Box>

        );
    };

    const renderOutfitPage = () => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_dict = libmoji.getBrands(selected_gender)
        let brandObject: any
        for (let key in brands_dict) {
            if (brands_dict[key]["name"] == brand) {
                brandObject = brands_dict[key];
                break
            }
        }

        let outfitList = [];
        for (var key in brandObject["outfits"]) {
            outfitList.push(brandObject["outfits"][key]["outfit"])
        }

        return (
            <FormGroup>
                <InputLabel>Outfits</InputLabel>
                <Select value={outfit} label="Outfits" onChange={handleOutfitChange}>
                    {brandObject["outfits"].map((option: any, index: number) => (<MenuItem value={option["id"].toString()} key={index}>{option["outfit"]}</MenuItem>))}
                </Select>
            </FormGroup>
        )
    }

    const renderBrandsPage = () => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_list = libmoji.getBrands(selected_gender);

        return (
            <Box component="div" sx={{display: 'flex', width: boxWidth, flexDirection: 'column', justifyContent: 'space-evenly'}}>
            <FormGroup>
                <InputLabel>Brands</InputLabel>
                <Select value={brand} label="Brands" onChange={handleBrandChange}>
                    {brands_list.map((option: any) => (<MenuItem value={option["name"]} key={option["id"]}>{option["name"]}</MenuItem>))}
                </Select>
            </FormGroup>
            {brand ? (<>{renderOutfitPage()}</>): (<Box component="div" sx={{fontFamily: 'Google Sans, sans-serif'}}><p>You must select a brand before you can pick an outfit.</p></Box>)}
            </Box>
        ) 
    }

    const renderTraitsPage = () => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const selected_style = STYLE_MAP[style as keyof Object];

        const trait_dict = libmoji.getTraits(selected_gender, selected_style)
        let attribute_list: Array<any> = []
        let value_list: Array<any> = [];

        for (var key in trait_dict) {
            let attribute = [key, trait_dict[key]["key"]];
            attribute_list.push(attribute)
            value_list.push(trait_dict[key]["options"])
        }

        return (
            <Box component="div" sx={{display: 'flex', flexDirection: 'column', overflow: 'scroll', width: boxWidth, maxHeight: '35vh'}}>
                {attribute_list.map((option: any) => 
                <FormGroup>
                    <InputLabel>{option[1]}</InputLabel>
                    <Select label={option[1]}>
                        {value_list[option[0]].map((value: any, index: number) => (<MenuItem onClick={handleTraitsChange} value={option[1] + ":" + value["value"]} key={index}>{value["value"]}</MenuItem>))}
                    </Select>
                </FormGroup>
                )}
            </Box>         
        );
    }

    const renderPage = () => {
        switch (activeTab) {
            case changeTraitsTab:
                return renderTraitsPage()
            case changeBrandTab:
                return renderBrandsPage()
            default:
            return renderStructurePage();
        }
    }

    return <>{renderAvatarPage()}</>;
};

export default CreateAvatar;
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

    const {boxWidth} = useStyle();

    const navigate = useNavigate();

    useEffect(() => {
        if (gender && style) {
            if (gender == "1") {
                if (style == "1") {
                    setFinalPreviewUrl(libmoji.buildPreviewUrl("fashion", 3, 1, 1, 0, [], ""))
                    setFinalDictionary(MaleBitstrips)
                } else if (style == "4") {
                    setFinalPreviewUrl(libmoji.buildPreviewUrl("fashion", 3, 1, 4, 0, [], ""))
                    setFinalDictionary(MaleBitmoji)
                } else {
                    setFinalPreviewUrl(libmoji.buildPreviewUrl("fashion", 3, 1, 5, 0, [], ""))
                    setFinalDictionary(MaleCm)
                }
            } else {
                if (style == "1") {
                    setFinalPreviewUrl(libmoji.buildPreviewUrl("fashion", 3, 2, 1, 0, [], ""))
                    setFinalDictionary(FemaleBitstrips)
                } else if (style == "4") {
                    setFinalPreviewUrl(libmoji.buildPreviewUrl("fashion", 3, 2, 4, 0, [], ""))
                    setFinalDictionary(FemaleBitmoji)
                } else {
                    setFinalPreviewUrl(libmoji.buildPreviewUrl("fashion", 3, 2, 5, 0, [], ""))
                    setFinalDictionary(FemaleCm)
                }
            }
        setTraits(updateTraits())
        }
    }, [gender, style])

    useEffect(() => {
        setFinalPreviewUrl(renderAvatarPreview(gender, style, outfit))
    }, [outfit, traits])

    const handleBackButtonClick = () => {
        navigate('/');
        return;
    };

    const handleGenderChange = (event: SelectChangeEvent) => {
        setGender(event.target.value)
    }

    const handleStyleChange = (event: SelectChangeEvent) => {
        setStyle(event.target.value)
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

    const renderStructureMenu = () => { 
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
        )
    }

    const handleTraitsChange = (event: any) => {
        let attribute: string = ""
        let value: string = ""
        let raw_event_value = JSON.stringify(event.currentTarget.dataset)
        let event_value = raw_event_value.slice(10, raw_event_value.length - 2)

        let seen: boolean = false
        console.log(finalDictionary)
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

    const renderTraitsPage = (gender: string, style: string) => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const selected_style = STYLE_MAP[style as keyof Object];

        const trait_dict = libmoji.getTraits(selected_gender, selected_style)
        let attribute_list = []
        let value_list: Array<any> = [];

        for (var key in trait_dict) {
            let attribute = [key, trait_dict[key]["key"]];
            attribute_list.push(attribute)
            value_list.push(trait_dict[key]["options"])
        }

        return (
            attribute_list.map((option: any) => 
            <FormGroup>
                <InputLabel>{option[1]}</InputLabel>
                <Select label={option[1]}>
                    {value_list[option[0]].map((value: any, index: number) => (<MenuItem onClick={handleTraitsChange} value={option[1] + ":" + value["value"]} key={index}>{value["value"]}</MenuItem>))}
                </Select>
            </FormGroup>
            )
        )
    }

    const renderBrandsPage = (gender: string) => {
        const selected_gender = GENDER_MAP[gender as keyof Object];
        const brands_list = libmoji.getBrands(selected_gender);

        return (
            <FormGroup>
                <InputLabel>Brands</InputLabel>
                <Select value={brand} label="Brands" onChange={handleBrandChange}>
                    {brands_list.map((option: any) => (<MenuItem value={option["name"]} key={option["id"]}>{option["name"]}</MenuItem>))}
                </Select>
            </FormGroup>
        )
    }

    const renderOutfitsPage = (brand: string, gender: string) => {
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

    const renderTraitsMenu = () => {
        return (
            <Box component="div" sx={{width: boxWidth, display: "flex", flexDirection: "row", justifyContent: "space-evenly", background: "orange"}}>
                <Box component="div" id="traitMenu" sx={{display: "flex", flexDirection: "column", maxHeight: '40vh', overflow: "scroll"}}>
                    {gender && style ? (<>{renderTraitsPage(gender, style)}</>): (<div>Not ok</div>)}
                </Box>
                <Box component="div" sx={{display: "flex", flexDirection: "column"}}>
                    {gender ? (<>{renderBrandsPage(gender)}</>):<div>Select a gender to continue.</div>}
                    {brand ? (<>{renderOutfitsPage(brand, gender)}</>):<div>Select a brand to continue.</div>}
                </Box>
            </Box>
        )
    }

    const updateTraits = () => {
        let newTraits: Array<any> = [];
        console.log("final dictionary")
        console.log(finalDictionary)
        for (var key in finalDictionary) {
            if (finalDictionary[key]["value"] != null) {
                newTraits.push([finalDictionary[key]["key"], finalDictionary[key]["value"]])
            }
        }
        console.log(newTraits)
        return newTraits
    }

    const renderAvatarPreview = (gender: string, style: string, outfit: string) => {

        let previewUrl = (libmoji.buildPreviewUrl("fashion", 3, parseInt(gender), parseInt(style), 0, traits, outfit))

        return (
            previewUrl
        )
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
                <Box component="div" sx={{display: 'flex', justifyContent: 'space-evenly', width: boxWidth}}>
                {gender && style ? (<img width="40%" height="40%" src={finalPreviewUrl}/>) : (<div>Select a gender and style to continue.</div>)}
                </Box>
                {renderStructureMenu()}
                {renderTraitsMenu()}
            <Box component="div" sx={{display: 'flex', alignItems: "center", margin: "2vh 0 0 0"}}>
                <Button className = "shadow-update-button" onClick={handleContinueButtonClick} sx={{color: COLORS.primary}}>Continue</Button>
            </Box>
            </Box>

        );
    };

    return <>{renderAvatarPage()}</>;
};

export default CreateAvatar;
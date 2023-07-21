const libmoji = require('libmoji');


const createLibmojiAvatar = (selected_gender: string, selected_style: string) => {
    let final_dictionary: Array<any> = [];

    const trait_dict = libmoji.getTraits(selected_gender, selected_style)

    for (var key in trait_dict) {
        let attribute = [key, trait_dict[key]["key"]];

        final_dictionary.push({
            key: attribute[1],
            value: null//trait_dict[key]["options"][0]["value"]
        })
    }

    return final_dictionary
    
}

export const MaleBitstrips = createLibmojiAvatar("male", "bitstrips");
export const MaleBitmoji = createLibmojiAvatar("male", "bitmoji")
export const MaleCm = createLibmojiAvatar("male", "cm")
export const FemaleBitstrips = createLibmojiAvatar("female", "bitstrips");
export const FemaleBitmoji = createLibmojiAvatar("female", "bitmoji")
export const FemaleCm = createLibmojiAvatar("female", "cm")
        
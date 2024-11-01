
import { Service } from ".";
import { Repository } from "../adapter";

export const findAutocomplete = async (name: string) => {
    const users = await Repository.user.findAutocomplete(name);
    return Service.dto.autocompleteMapper('id', 'fullName', users);
}


export default {
    findAutocomplete,
}
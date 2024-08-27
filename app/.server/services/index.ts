import authService from "./auth.service";
import municipalityService from "./municipality.service";
import townService from "./town.service";
import folderService from "./folder.service";
import validationService from "./validation.service";
import autocompleteService from "./autocomplete.service";
import paginatorService from "./paginator.service";

function buildService() {
    return {
        auth: { ...authService },
        municipality: {...municipalityService },
        validation: { ...validationService },
        town: { ...townService },
        folder: { ...folderService },
        autocomplete: { ...autocompleteService },
        paginator: { ...paginatorService },
    }
}

export const Service = buildService();
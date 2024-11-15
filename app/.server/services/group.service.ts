import { Group } from "@prisma/client";
import { Repository } from "../adapter"

export const generateGroups = async () => {
    const groups = await Repository.group.findGroupWithCredits();

    if(!groups || groups.length === 0) return;

    const groupsPrepared = prepateToCreate(groups as Group[]);
    const newGroups = await Repository.group.createMany(groupsPrepared);
    // TODO: VERIFY IF IS NECESARY UPDATE THE SUCCESSOR.
    const promises = prepareToUpdate(groups as Group[], newGroups as Group[]);

    await Promise.all(promises);
    return;
}

const prepateToCreate = (groups: Group[]) => {
    return groups.map(({ id, name, folderId }) => ({ 
        name: Number(name) + 1, 
        folderId, 
        predecessorId: id 
    }));
}

const prepareToUpdate = (oldGroups: Group[], groups: Group[]) => {
    const promises = [];
    const cloneOldGroups = [ ...oldGroups ];
    for (let index = 0; index < groups.length; index++) {
        for (let j = 0; j < cloneOldGroups.length; j++) {
            const { id } = cloneOldGroups[j];
            const { predecessorId } = groups[index];
            if(id === predecessorId) {
                promises.push(Repository.group.updateSuccessor(id, groups[index].id));
                cloneOldGroups.splice(j,1);
                break;
            }
            
        }
        
    }
    return promises;
}

export default  {
    generateGroups,
}
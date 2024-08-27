import { BaseGroupI, GroupRepositoryI } from "~/.server/domain/interface";

export function GroupRepository(base: BaseGroupI): GroupRepositoryI {

    async function deleteMany(groupsId: number[]) {
        return await base.deleteMany({ id: { in: groupsId }});
    }

    async function createOne(name: number, folderId: number) {
        return await base.createOne({ name, folderId });
    }

    return {
        base,
        deleteMany,
        createOne,
    }
}
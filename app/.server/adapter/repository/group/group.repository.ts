import { GroupRepositoryI } from "~/.server/domain/interface/Group.repository.interface";
import { db } from "../../db";
import { baseRepository } from "../base.repository";


export function GroupRepository(): GroupRepositoryI {

    const base = baseRepository(db.group);

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
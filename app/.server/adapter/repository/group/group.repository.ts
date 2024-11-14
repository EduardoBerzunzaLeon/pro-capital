import { BaseGroupI, CreateGroup, GroupRepositoryI } from "~/.server/domain/interface";

export function GroupRepository(base: BaseGroupI): GroupRepositoryI {

    async function deleteMany(groupsId: number[]) {
        return await base.deleteMany({ id: { in: groupsId }});
    }

    async function createOne(name: number, folderId: number) {
        return await base.createOne({ name, folderId });
    }

    async function findGroupWithCredits() {
        return await base.findMany({ 
            searchParams: {
                credits: {
                    some: { avalId: { not: 0 } }
                },
                successor: null
            },
            select: {
                name: true,
                folderId: true,
                id: true,
            }
        })
    }

    async function createMany(groups: CreateGroup[])  {
        return await base.createManyAndReturn(groups, true);
    }

    async function updateSuccessor(id: number, successorId: number) {
        const data = { successor: { connect:  { id: successorId } }};
        return await base.updateOne({ id }, data)
        // return await base.entity.update({ where: { id }, data: { 
        //     successor: { update: { id: successorId }}
        // } })
    }

    return {
        base,
        deleteMany,
        createOne,
        updateSuccessor,
        findGroupWithCredits,
        createMany
    }
}
import { Repository } from "../adapter"

export const findMany = async () => {
    return await Repository.role.findMany()
}

export default {
    findMany
}
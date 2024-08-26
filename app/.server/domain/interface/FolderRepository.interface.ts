import { GenericRepository } from '../../adapter/repository/base.repository.inteface';

export interface FolderRepositoryI extends GenericRepository {
    findLastConsecutive: (townId: number) => Promise<number>,
}


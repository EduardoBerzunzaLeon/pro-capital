import { PaginationWithFilters } from "../domain/interface/Pagination.interface";
import { Generic } from "../interfaces";

type SortOrder = 'asc' | 'desc';

export function apiPrismaFeatures({ 
    page, 
    limit, 
    column, 
    direction, 
    search 
}: PaginationWithFilters) {


    function convert(namesArray: string[], val: unknown) {
      const result: Generic = {};
      let nestedObj = result;
      
      namesArray.forEach((name, index) => {
        nestedObj[name] = index === namesArray.length - 1 ? val : {};
        nestedObj = nestedObj[name];
      });
    
      return result;
    }

    function orderBy() {
        if(!column || !direction) return {}
        const directionBy: SortOrder = direction === 'ascending' ? 'asc': 'desc';
        const columns = column.split('.');
        return  convert(columns, directionBy);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getCondition(value: any) {
      if(value === 'notUndefined') {
        return { not: undefined }
      }

      if(Array.isArray(value)) {
        return { in: value }
      }

      if(typeof value === 'string') {
        return { contains: value.toLowerCase() }
      }
      
      if(typeof value === 'boolean' || typeof value === 'number') {
        return { equals: value }
      }
      
      if(value?.start && value?.end)  {
        return {
          gte: value['start'],
          lte: value['end'],
        }
      }

      return { contains: value };
    }

    function filter() {

        if(search.length === 0) return null;

        const whereClause = search.reduce((acc, { column, value }) => {

          if(value === '') return acc;

          const columnArray = column.split('.');

          const condition = getCondition(value);
          const whereCondition = convert(columnArray, condition);

          for (const key in whereCondition) {
            if (key in acc) {
              acc[key] = { ...acc[key], ...whereCondition[key] };
              return acc;
            }
          }

          return { ...acc, ...whereCondition }

        }, {} as Generic);

        return whereClause;

    }

    function paginate() {
      return {
        skip: (page - 1) * limit,
        take: limit,
      };
    }

    function getMetadata(total: number) {
      const pageCount = Math.ceil(total / limit);
      const nextPage = page < pageCount ? page + 1: null;

      return {
        pageCount,
        total,
        nextPage,
        currentPage: page
      }
    }
 
      return  {
        orderBy,
        convert,
        filter,
        paginate,
        getMetadata
      }

}


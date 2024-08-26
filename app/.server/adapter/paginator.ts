import { PaginationWithFilters } from "../domain/interface/Pagination.interface";
import { Generic } from "../interfaces";

type SortOrder = 'asc' | 'desc';

export function apiPrismaFeatures({ 
    page, 
    limit, 
    column, 
    direction, 
    search 
}: PaginationProps) {


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

    function filter() {

        if(search.length === 0) return null;

        const whereClause = search.reduce((acc, { column, value }) => {

          if(value === '') return acc;

          const columnArray = column.split('.');
          const whereCondition = convert(columnArray, { contains: value.toLowerCase() });

          // acc.where = {
          //   ...acc.where,
          //   ...whereCondition
          // }
          acc = {
            ...acc,
            ...whereCondition
          }

          return acc;

        }, {});

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
        page
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


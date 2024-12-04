import { Generic } from '~/.server/interfaces';
import { handlerPaginationParams } from '~/.server/reponses';
import { Filter } from '~/.server/domain/interface';
import dayjs from 'dayjs';

const convertRoutes = (routes: string) =>  {
    return routes.split(',').map(r => parseInt(r));
  }

export const AgentParams = () => {

    const columnSortNames: Generic = {
        route: 'route.id',
        user: 'user.fullName',
        assignAt: 'assignAt'
      }

      
    const columnsFilter = ['route.name', 'user.fullName', 'assignAt' ];

    const defaultColumn = 'assignAt';

    const getParams = (request: Request) => {

        const url = new URL(request.url);
        const routes = url.searchParams.get('routes');
        const agent = url.searchParams.get('agent') || '';
        const start = url.searchParams.get('start') || '';
        const end = url.searchParams.get('end') || '';
      
        const routesParsed: Filter  = (routes && routes !== 'all') 
          ? { column: 'route.id', value: convertRoutes(routes)}
          : { column: 'route.id', value: '' };
      
        const agentParsed: Filter = { column: 'user.fullName', value: agent };
      
        const datesParsed = (!start || !end) 
          ? { column: 'assignAt', value: ''}
          : { column:  'assignAt', value: {
            start: dayjs(start+'T00:00:00.000Z').toDate(),
            end: dayjs(end).toDate()
          }}

        const { 
            page, limit, column, direction
          } = handlerPaginationParams(request.url, defaultColumn, columnsFilter);

        return {
            params: {
                page, 
                limit, 
                column: columnSortNames[column] ?? defaultColumn, 
                direction,
                search: [routesParsed, agentParsed, datesParsed]
            },
            search: {
                agent,
                routes: routesParsed.value,
                start,
                end
            }
        }
    }

    return  {
        getParams
    }
}
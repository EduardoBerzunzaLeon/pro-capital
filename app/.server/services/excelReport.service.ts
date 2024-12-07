

export interface FolderProps {
    name: string;
    town: {
        name: string;
        municipality: {
            name: string
        }
    },
    route: {
        name: string,
    },
    leaders: { fullname: string }[],
    _count: {
        groups: number
    }
}


export const folderReport = (props?: FolderProps[]) => {

    if(!props) {
        return [];
    }

    return props.map(({
        name, town, route, leaders, _count
    }) => {

        return {
            name,
            town: town.name,
            municipality: town.municipality.name,
            route: route.name,
            leader: leaders.length > 0 ? leaders[0].fullname : '',
            groups: _count.groups
        };
    })
}

export interface TownProps {
    name: string,
    municipality: {
        name: string
    }
}

export const townReport = (props?: TownProps[]) => {

    if(!props) {
        return [];
    }

    return props.map(({
        name, municipality
    }) => {

        return {
            name,
            municipality: municipality.name,
        };
    })
}



export default {
    folderReport,
    townReport
}
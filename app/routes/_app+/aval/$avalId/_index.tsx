import { LoaderFunction } from "@remix-run/node";
import { Service } from "~/.server/services";


export const loader: LoaderFunction = async({ params }) => {
    console.log({params});

    try {
        // return  await Service.aval.findOne(params.avalId);
    } catch (error) {
        console.log({error})
        return []
    }

}
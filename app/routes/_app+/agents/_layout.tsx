import { json, LoaderFunction } from "@remix-run/node";
import { handlerSuccess } from "~/.server/reponses";
import { getEmptyPagination } from "~/.server/reponses/handlerError";

export const loader: LoaderFunction = async () => {

  try {
      return handlerSuccess(200, []);
    } catch (error) {
      console.log(error);
      return json(getEmptyPagination())
    }
    
}

export default function  AgentsPage()  {
  return (
    <div>Agent</div>
  )
}

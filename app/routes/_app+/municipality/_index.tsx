import { LoaderFunction } from "@remix-run/node";
import { Service } from "~/.server/services";

export const loader: LoaderFunction = async ({ request }) => {
  
    const url = new URL(request.url);
    const page = url.searchParams.get('pm') || 1;
    const limit = url.searchParams.get('lm') || 2;
  
    try {
      return await Service.municipality.findAll(Number(page), Number(limit));
    } catch (error) {
      return [];  
    }
    
  }

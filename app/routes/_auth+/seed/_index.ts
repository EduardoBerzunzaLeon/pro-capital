import { LoaderFunction } from "@remix-run/node";
import { seed } from "prisma/seed";

export const loader: LoaderFunction = async () => {

  try {
    await seed();
    return '';
  } catch (error) {
   
    return '';
  }
}
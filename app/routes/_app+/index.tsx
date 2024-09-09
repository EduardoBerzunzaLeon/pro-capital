import { useLoaderData } from "@remix-run/react"

export const loader = async () => {
  return {
    holi: 'dashboard'
  }
}


export default function Index() {

  const loader = useLoaderData();

  console.log({loaderDash: loader});

  return (
    <>dashboard</>
  )
} 
  
import { useLoaderData } from "@remix-run/react";
import { MunicipalitySection, RouteSection, TownSection } from "~/components/ui";
import { FolderSection } from "~/components/ui/folder";


export const loader = async () => {
  return {
    data: 'region'
  }
}

export default function RegionPage() {

  const loader = useLoaderData();
  console.log({loaderRegion: loader})
  

  return (
    <div className='w-full flex gap-2 flex-col'>
      <RouteSection />
      <FolderSection />
      
      <div className='flex gap-2 flex-wrap justify-between'>
        <MunicipalitySection />
        <TownSection />
      </div>
    </div>
  )
}
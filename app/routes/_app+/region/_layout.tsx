import { MunicipalitySection, RouteSection, TownSection } from "~/components/ui";
import { FolderSection } from "~/components/ui/folder";

export default function RegionPage() {

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
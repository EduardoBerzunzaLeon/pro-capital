import { ErrorBoundary, MunicipalitySection, RouteSection, TownSection } from "~/components/ui";
import { FolderSection } from "~/components/ui/folder";
import { LoaderFunction } from '@remix-run/node';
import { Service } from '~/.server/services';
import { permissions } from '~/application';

export const loader: LoaderFunction = async ({ request }) => {
  await Service.auth.requirePermission(request, permissions.region.permissions.view); 
  return '';
}

export { ErrorBoundary }
export default function RegionPage() {

  return (
    <div className='w-full flex gap-2 flex-col'>
      <FolderSection />
      <TownSection />
      
      <div className='flex gap-2 flex-wrap justify-between'>
        <RouteSection />
        <MunicipalitySection />
      </div>
    </div>
  )
}
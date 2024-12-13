import { ErrorBoundary, MunicipalitySection, RouteSection, TownSection } from "~/components/ui";
import { FolderSection } from "~/components/ui/folder";
import { LoaderFunction } from '@remix-run/node';
import { Service } from '~/.server/services';
import { permissions } from '~/application';
import { Permission } from '../../../components/ui/auth/Permission';
import { FaRoute } from "react-icons/fa";

export const loader: LoaderFunction = async ({ request }) => {
  await Service.auth.requirePermission(request, permissions.region.permissions.view); 
  return '';
}

export const handle = {
  breadcrumb: () => ({
    href: '/region',
    label: 'Rutas',
    startContent: <FaRoute />,
  })
}


export { ErrorBoundary }
export default function RegionPage() {

  return (
    <div className='w-full flex gap-2 flex-col'>
      <Permission permission={permissions.folder.permissions.view}>
        <FolderSection />
      </Permission>
      <Permission permission={permissions.town.permissions.view}>
        <TownSection />
      </Permission>
      
      <div className='flex gap-2 flex-wrap justify-between'>
        <Permission permission={permissions.route.permissions.view}>
          <RouteSection />
        </Permission>
        <Permission permission={permissions.municipality.permissions.view}>
          <MunicipalitySection />
        </Permission>
      </div>
    </div>
  )
}
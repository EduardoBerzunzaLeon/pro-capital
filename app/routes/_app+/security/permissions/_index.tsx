import { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = ({ request }) => {
    const url = new URL(request.url);
    const roles = url.searchParams.get('roles') || '';

    console.log({roles, url});
    return roles;

}

export default function Test() {
    return (<p>testpages</p>)
}
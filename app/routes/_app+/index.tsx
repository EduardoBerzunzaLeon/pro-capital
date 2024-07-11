import { Link } from "@remix-run/react";

export default function Index() {
    return (

      <div>
       <Link to="/login"  prefetch="none">Login</Link>
       <Link to="/capture"  prefetch="none">Captura</Link>
      </div>
    )
  } 
  
import { Link } from '@remix-run/react';


export default function Capture() {
    return (
      <div>
        <Link to="/"  prefetch="none">Home</Link>
        Capture
      </div>
    )
  }
  
import Link from "next/link";

export default function NotFound() {
  return <div className="fatal-error"><span>404</span><h1>That route is outside the graph.</h1><p>Return to the mission control dashboard.</p><Link className="button button-primary" href="/">Go home</Link></div>;
}

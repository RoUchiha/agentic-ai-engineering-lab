"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="fatal-error"><span>WORKFLOW ERROR</span><h1>The lab hit an unexpected state.</h1><p>The safe default is to stop and expose the failure instead of hiding it.</p><button onClick={reset}>Try again</button></div>;
}

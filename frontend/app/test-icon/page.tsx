"use client";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export default function Test() {
  const ref = useRef<SVGSVGElement>(null);
  const [html, setHtml] = useState("");
  useEffect(() => {
    if (ref.current) setHtml(ref.current.innerHTML);
  }, []);
  return (
    <div>
      <h1>Test Icon</h1>
      <Search id="test-search-icon" size={64} color="red" ref={ref} />
      <pre>Inner HTML: {html}</pre>
    </div>
  );
}

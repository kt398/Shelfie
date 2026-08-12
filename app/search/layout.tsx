import { Suspense } from "react";
import SearchBar from "./_components/SearchBar";
import Sidebar from "./_components/Sidebar"

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-4 text-2xl font-bold">Search</h1>
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>
        <div className="mt-6 mr-6 ml-6 mb-6">{children}</div>
    </div>
  );
}

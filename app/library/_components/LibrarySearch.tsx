"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"


export default function LibrarySearch(){

    
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams.get("q") ?? "");

    useEffect(() => {
    setValue(searchParams.get("q") ?? "");
    }, [searchParams]);
    useEffect(() => {
        const timeout = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set("q", value);
        else params.delete("q");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }, 300);

        return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <input
            className="rounded border border-border px-3 py-2 text-sm dark:bg-gray-900"
            placeholder="Search your library"
            value={value}
            onChange={(e) => setValue(e.target.value)}   
        />
    )
}
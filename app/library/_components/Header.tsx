import { LibraryStatus } from "@prisma/client"
import LibrarySearch from "./LibrarySearch"

export default function Header({ counts }: { counts: Record<LibraryStatus, number> })
{
    return (
        <div className="ml-4 mb-4 mt-6 ">
            <div className="mr-4 flex items-center justify-between">
                <div>
                    <h1 className="font-[Georgia] text-3xl">Your Shelf</h1>
                    <div className="text-xs tracking-wider text-muted-foreground font-[Segoe UI]">
                        {counts.IN_PROGRESS} IN PROGRESS · {counts.COMPLETED} COMPLETED · {counts.PLANNED} PLANNED
                    </div>
                </div>
                <LibrarySearch/>
            </div>
            <hr className="my-6 mx-6 border-t border-border" />
        </div>

    )
}
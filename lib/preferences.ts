import { prisma } from "@/lib/db";
import type { DateDefault } from "@prisma/client";


export async function getUserPreferences(
    userId: string
): Promise<{ defaultDateStarted: DateDefault; defaultDateFinished: DateDefault; }> {
    const prefs = await prisma.userPreferences.findUnique({where: {userId}});
    
    return {
        defaultDateStarted: prefs?.defaultDateStarted ?? "EMPTY",
        defaultDateFinished: prefs?.defaultDateFinished ?? "EMPTY",  
    };
}
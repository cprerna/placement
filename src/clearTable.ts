import { db } from "./db/drizzle";
import { studentsTable } from "./db/schema";

export async function clearTable() {
    try {
        await db.delete(studentsTable);
    } catch (error) {
        console.error("Error clearing table:", error);
    }
}

clearTable();
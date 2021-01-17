import { COLLECTIONS } from "../config/constants";

export async function getLastid(db: any) {

    let lastId = await db.collection(COLLECTIONS.VOTES).find().sort({ _id: -1 }).limit(1).toArray();
    if (lastId.length === 0) {
        return "1";
    }
    return String(++lastId[0].id);
}

export async function getVote(db: any, id: string) {
    return db.collection(COLLECTIONS.VOTES).findOne({ id });
}
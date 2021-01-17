import { IResolvers } from 'graphql-tools';
import { Db } from 'mongodb';
import { COLLECTIONS } from '../config/constants';

const types: IResolvers = {
    Character: {
        votes: async (parent: any, _: any, { db }) => {
            return await db.collection(COLLECTIONS.VOTES).find({ character: parent.id }).count();
        },
        photo: (parent: any) => COLLECTIONS.PHOTO_URL.concat(parent.photo)
    }
};

export default types;
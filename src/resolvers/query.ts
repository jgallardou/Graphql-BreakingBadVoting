import { IResolvers } from 'graphql-tools';
import { Db } from 'mongodb';
import { COLLECTIONS } from '../config/constants';

const query: IResolvers = {
    Query: {
        async characters(_: void, __: any, { db }) {
            return await db.collection(COLLECTIONS.CHARACTERS).find().sort({ id_: 1 }).toArray();
        },

        async character(_: void, { id }, { db }) {
            return await db.collection(COLLECTIONS.CHARACTERS).findOne({ id });
        }
    }
};

export default query;
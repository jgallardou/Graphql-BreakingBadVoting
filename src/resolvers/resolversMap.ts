import { IResolvers } from 'graphql-tools';
import types from './types';
import query from './query';
import mutation from './mutation';
import subscription from './subscription';

export const LIST: string[] = [];
const resolvers: IResolvers = {
    ...query,
    ...mutation,
    ...subscription,
    ...types
};

export default resolvers;
import { IResolvers } from 'graphql-tools';
import { CHANGE_VOTE, CHANGE_VOTES, COLLECTIONS } from '../config/constants';
import { getLastid, getVote } from '../lib/database-operations';
import { Datetime } from '../lib/datetime';


async function sendNotification(pubsub: any, db: any, id: string) {
    const characters: Array<object> = await db.collection(COLLECTIONS.CHARACTERS).find().sort({ id: 1 }).toArray();
    pubsub.publish(CHANGE_VOTES, { changeVotes: characters });
    // FIltrar el personaje seleccionado de la lista 
    const selectCharacter = characters.filter((c: any) => c.id == id)[0];
    pubsub.publish(CHANGE_VOTE, { changeVote: selectCharacter });
}


const mutation: IResolvers = {
    Mutation: {
        async addVote(_: void, { character }, { pubsub, db }) {
            //validar si existe el personaje
            let selectCharacter = await db.collection(COLLECTIONS.CHARACTERS).findOne({ id: character });

            if (selectCharacter === null) {
                return {
                    status: false,
                    message: `El ID ${character} del personaje no existe`,
                    character: null
                }
            }

            //Obtener id del ultimo voto
            const vote = {
                id: await getLastid(db),
                character,
                createdAt: new Datetime().getCurrentDateTime()
            }

            return await db.collection(COLLECTIONS.VOTES).insertOne(vote).then(() => {
                sendNotification(pubsub, db, character);
                return {
                    status: true,
                    message: "Voto agregado",
                    character: selectCharacter
                }
            }).catch((err: any) => {
                return {
                    status: false,
                    message: "Hubo un error: " + err,
                    character: null
                }
            });
        },
        async updateVote(_: void, { id, character }, { pubsub, db }) {
            //Comprobar que el personaje existe
            let selectCharacter = await db.collection(COLLECTIONS.CHARACTERS).findOne({ id: character });

            if (selectCharacter === null) {
                return {
                    status: false,
                    message: `El ID ${character} del personaje no existe`,
                    character: null
                }
            }

            console.log(selectCharacter);


            //Comprobar que el voto existe

            let selectVote = await getVote(db, id);
            if (selectVote === null || selectVote === undefined) { return { status: false, message: "El voto introducido es invalido", character: null } }

            //Actualizar el voto despues de comprobar 


            return await db.collection(COLLECTIONS.VOTES).updateOne({ id }, { $set: { character } }).then(() => {
                sendNotification(pubsub, db, character);
                return {
                    status: true,
                    message: "Voto actualizado correctamente",
                    character: selectCharacter
                }
            }).catch((err: any) => {
                console.log(err);

            });
        },
        async deleteVote(_: void, { id }, { pubsub, db }) {
            //Validar que el voto exista
            let selectVote = await getVote(db, id);

            if (selectVote === null || selectVote === undefined) {
                return {
                    status: false,
                    message: "El id voto ingresado no existe :(",
                    character: null
                }
            }

            return db.collection(COLLECTIONS.VOTES).deleteOne({ id }).then(() => {
                sendNotification(pubsub, db, id);
                return {
                    status: true,
                    message: "El voto fue borrado exitosamente",
                    character: null
                }
            });
        }
    }
};

export default mutation;
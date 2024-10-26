// schema QL query and mutation
import { supabase } from './supabaseDb';
import { makeExecutableSchema } from '@graphql-tools/schema';

const typeDefs = `
  type User {
    id: ID!
    telegramId: String!
    userName: String!
    balance: Int!
  }

  type Query {
    getBalanceById(telegramId: String!): User
  }

  type Mutation {
    updateCoinBalance(userId: ID!, newBalance: Int!): User
  }
`;

const resolvers = {
    Query: {
        //------getBalanceById as telegram ID
        async getBalanceById(_: any, { telegramId }: { telegramId: string }) {
            //console.log("telegramId=", telegramId);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('telegramId', telegramId)
                .single();

            //console.log("data=", data);
            if (error) {
                //console.log("error=", error);
                throw new Error(error.message);
            }
            return data;
        },
    },
    Mutation: {
        // Update balance by User Id
        async updateCoinBalance(_: any, { userId, newBalance }: { userId: string; newBalance: number }) {
            const { data, error } = await supabase
                .from('users')
                .update({ balance: newBalance })
                .eq('id', userId)
                .select('*')
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    },
};

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
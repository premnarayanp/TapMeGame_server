"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
// schema QL query and mutation
const supabaseDb_1 = require("./supabaseDb");
const schema_1 = require("@graphql-tools/schema");
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
        getBalanceById(_1, _a) {
            return __awaiter(this, arguments, void 0, function* (_, { telegramId }) {
                //console.log("telegramId=", telegramId);
                const { data, error } = yield supabaseDb_1.supabase
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
            });
        },
    },
    Mutation: {
        // Update balance by User Id
        updateCoinBalance(_1, _a) {
            return __awaiter(this, arguments, void 0, function* (_, { userId, newBalance }) {
                const { data, error } = yield supabaseDb_1.supabase
                    .from('users')
                    .update({ balance: newBalance })
                    .eq('id', userId)
                    .select('*')
                    .single();
                if (error) {
                    throw new Error(error.message);
                }
                return data;
            });
        },
    },
};
exports.schema = (0, schema_1.makeExecutableSchema)({
    typeDefs,
    resolvers,
});

import { gql } from 'apollo-server'
import { Context } from './context'
import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = gql`
  type Query {
    getAllTransactions(page: Int!): [Transaction!]
    getTransByAccountIdAndRangeDate(accountId: String!, initialDate: String!, finalDate: String!): [Transaction!]
  }
  type Transaction {
    id: String!
    accountId:   String!
    categoryId:   String!
    reference:   String !
    amount:      String!
    currency: String!
    date: String!
  }
`

const resolvers = {
    Query: {
        getAllTransactions: async (_obj: any, args: any, context: Context, _info: any) => {
            const { page } = args;
            console.log('page', page);
            const skipNumber = page === 1 ? 0 : (10 * (page -1));
            const response = await context.prisma.transaction.findMany({
                take: 10,
                skip: skipNumber
            })

            return response
        },
        getTransByAccountIdAndRangeDate: async (_obj: any, args: any, context: Context, _info: any) => {
            const { accountId, initialDate, finalDate } = args;

            const response = await context.prisma.transaction.findMany({
                where: {
                    accountId: accountId,
                    date: {
                        gte: new Date(initialDate),
                        lt: new Date(finalDate)
                    }
                },
            })

            return response
        }
    }
}

export const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
})
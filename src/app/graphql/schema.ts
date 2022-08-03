import { gql } from 'apollo-server'
import { Context } from './context'
import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = gql`
  type Query {
    getAllTransactions(page: Int!): [Transaction!]
    getCategory(categoryId: String!): Category!
    getAccount(accountId: String!): Account!
    getAllAccounts: [Account!]
    getTransByAccountIdAndRangeDate(page: Int!, accountId: String!, initialDate: String!, finalDate: String!): [Transaction!]
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
  type Category {
    id: String
    name: String
    color: String
  }
  type Account {
    id: String!
    name: String!
  }
`

const resolvers = {
    Query: {
        getAllTransactions: async (_obj: any, args: any, context: Context, _info: any) => {
            const { page } = args;
            const skipNumber = page === 1 ? 0 : (10 * (page - 1));
            const response = await context.prisma.transaction.findMany({
                take: 10,
                skip: skipNumber
            })

            return response
        },
        getCategory: async (_obj: any, args: any, context: Context, _info: any) => {
            const { categoryId } = args;
            const category = await context.prisma.category.findUnique({
                where: {
                    id: categoryId
                }
            })
            return category
        },
        getAccount: async (_obj: any, args: any, context: Context, _info: any) => {
            const { accountId } = args;
            const account = await context.prisma.account.findUnique({
                where: {
                    id: accountId
                }
            })
            return account
        },
        getAllAccounts: async (_obj: any, args: any, context: Context, _info: any) => {
            const accounts = await context.prisma.account.findMany({});
            return accounts
        },
        getTransByAccountIdAndRangeDate: async (_obj: any, args: any, context: Context, _info: any) => {
            const { page, accountId, initialDate, finalDate } = args;
            const skipNumber = page === 1 ? 0 : (10 * (page - 1));
            const response = await context.prisma.transaction.findMany({
                take: 10,
                skip: skipNumber,
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
import { PrismaClient } from '@prisma/client'

const Fs = require('fs/promises')

const prisma = new PrismaClient()

export const main = async () => {

// SEEDING TRANSACTIONS
const json = await Fs.readFile('prisma/transactions.json')  
const parsedJson = JSON.parse(json);

const data = [...parsedJson.transactions]
const allData = data.map((d) => {
  d.date = new Date(d.date);
  return prisma.transaction.create({
    data: d,
  })
})

await Promise.all(allData);

// SEEDING ACCOUNTS
const jsonAccounts = await Fs.readFile('prisma/accounts.json')  
const parsedJsonAccounts = JSON.parse(jsonAccounts);

const dataAccounts = [...parsedJsonAccounts.accounts]
const allDataAccounts = dataAccounts.map((d) => {
  return prisma.account.create({
    data: d,
  })
})

await Promise.all(allDataAccounts);

// SEEDING CATEGORIES
const jsonCategories = await Fs.readFile('prisma/categories.json')  
const parsedJsonCategories = JSON.parse(jsonCategories);

const dataCategories = [...parsedJsonCategories.categories]
const allDataCategories = dataCategories.map((d) => {
  return prisma.category.create({
    data: d,
  })
})

await Promise.all(allDataCategories);

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
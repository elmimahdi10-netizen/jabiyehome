import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const data = await prisma.category.findMany()
  console.log(data)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
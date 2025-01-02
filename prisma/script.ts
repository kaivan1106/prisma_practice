import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  const createUser = async (name: string, email: string) => {
    const user = await prisma.user.create({
      data: { name, email },
    });
    console.log('User created:', user);
  };

  
  const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    console.log('All users:', users);
  };

  
  const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    console.log('User found:', user);
  };

  
  const updateUser = async (id: number, data: { name?: string; email?: string }) => {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    console.log('User updated:', user);
  };

  
  const deleteUser = async (id: number) => {
    const user = await prisma.user.delete({
      where: { id },
    });
    console.log('User deleted:', user);
  };

  
  await createUser('Kaivan Taswala', 'kaivan111@example.com');
  await getAllUsers();
  await getUserById(4);
  await updateUser(4, { name: 'Kaivan' });
  await deleteUser(4);
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

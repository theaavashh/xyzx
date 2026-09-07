import { prisma } from '../lib/database';

async function main() {
  const fks = (await prisma.$queryRawUnsafe<{ TABLE_NAME: string; CONSTRAINT_NAME: string }[]>(
    `SELECT TABLE_NAME, CONSTRAINT_NAME
     FROM information_schema.TABLE_CONSTRAINTS
     WHERE CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_SCHEMA = DATABASE()`,
  )) as { TABLE_NAME: string; CONSTRAINT_NAME: string }[];

  for (const fk of fks) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE \`${fk.TABLE_NAME}\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``,
    );
    console.log(`[drop-foreign-keys] dropped FK ${fk.CONSTRAINT_NAME} on ${fk.TABLE_NAME}`);
  }

  console.log(`[drop-foreign-keys] done (${fks.length} foreign keys dropped)`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[drop-foreign-keys] failed:', err);
    process.exit(1);
  });

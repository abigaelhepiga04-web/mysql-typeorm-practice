import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentTable1792415260239 implements MigrationInterface {
    name = 'CreateCommentTable1792415260239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`taskId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_9adf2d3106c6dc87d6262ccadf\` (\`taskId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_9adf2d3106c6dc87d6262ccadfe\` FOREIGN KEY (\`taskId\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_9adf2d3106c6dc87d6262ccadfe\``);
        await queryRunner.query(`DROP INDEX \`IDX_9adf2d3106c6dc87d6262ccadf\` ON \`comments\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
    }

}

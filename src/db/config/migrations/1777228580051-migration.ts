import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777228580051 implements MigrationInterface {
    name = 'Migration1777228580051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_sessions" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "active_sessions" ADD "bondageDescription" text`);
        await queryRunner.query(`ALTER TABLE "active_sessions" ADD "gagDescription" text`);
        await queryRunner.query(`ALTER TABLE "active_sessions" ADD "blindfoldDescription" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_sessions" DROP COLUMN "blindfoldDescription"`);
        await queryRunner.query(`ALTER TABLE "active_sessions" DROP COLUMN "gagDescription"`);
        await queryRunner.query(`ALTER TABLE "active_sessions" DROP COLUMN "bondageDescription"`);
        await queryRunner.query(`ALTER TABLE "active_sessions" ADD "description" text NOT NULL`);
    }

}

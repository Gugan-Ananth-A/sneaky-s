import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776953939284 implements MigrationInterface {
    name = 'Migration1776953939284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_sessions" ADD "description" character varying(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "active_sessions" ADD "duration" integer`);
        await queryRunner.query(`ALTER TABLE "active_sessions" ADD "status" character varying NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "active_sessions" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "active_sessions" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "active_sessions" DROP COLUMN "description"`);
    }

}

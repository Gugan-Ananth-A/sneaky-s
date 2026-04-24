import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776864043578 implements MigrationInterface {
    name = 'Migration1776864043578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_settings" ("userId" character varying NOT NULL, "gag" boolean NOT NULL DEFAULT false, "blindfold" boolean NOT NULL DEFAULT false, "defaultDuration" integer NOT NULL DEFAULT '30', "safeword" character varying, CONSTRAINT "PK_986a2b6d3c05eb4091bb8066f78" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "active_sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "guildId" character varying NOT NULL, "channelId" character varying NOT NULL, "originalRoles" text array NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "gag" boolean NOT NULL DEFAULT false, "blindfold" boolean NOT NULL DEFAULT false, "safeword" character varying, CONSTRAINT "PK_8adff44cf2b22fd7ac602019bf6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "active_sessions"`);
        await queryRunner.query(`DROP TABLE "user_settings"`);
    }

}

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_settings')
export class UserSettings {
  @PrimaryColumn()
  userId?: string;

  @Column({ default: false })
  gag?: boolean;

  @Column({ default: false })
  blindfold?: boolean;

  @Column({ type: 'int', default: 30 })
  defaultDuration?: number;

  @Column({ nullable: true })
  safeword?: string;
}

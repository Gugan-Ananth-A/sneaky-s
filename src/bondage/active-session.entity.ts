import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('active_sessions')
export class ActiveSession {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  userId?: string;

  @Column()
  guildId?: string;

  @Column({ type: 'varchar', length: 1000 })
  description?: string;

  @Column()
  channelId?: string;

  @Column('text', { array: true })
  originalRoles?: string[];

  @Column()
  startTime?: Date;

  @Column()
  endTime?: Date;

  @Column({ default: false })
  gag?: boolean;

  @Column({ default: false })
  blindfold?: boolean;

  @Column({ nullable: true })
  safeword?: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ default: 'active' })
  status?: string;
}

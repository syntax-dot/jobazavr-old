import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('jobs_subscriptions')
@Index('title', ['title'], {})
export class JobsSubscriptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ length: 256 })
  title: string;

  @Column()
  created_at: number;
}

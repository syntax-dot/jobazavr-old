import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('sync_queue')
export class SyncQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column()
  created_at: number;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventsKeys } from './events-keys.entity';
import { Users } from './users.entity';

@Entity('events')
export class Events {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column()
  @ManyToOne(() => EventsKeys, (event_key) => event_key.id)
  @JoinColumn({ name: 'event_id' })
  event_id: number;

  @Column({ length: 512, nullable: true, default: null })
  event_data: string;

  @Column()
  created_at: number;
}

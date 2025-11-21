import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events_keys')
export class EventsKeys {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32 })
  event_key: string;

  @Column({ length: 256 })
  event_name: string;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('club_forms')
export class ClubForms {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ length: 11, default: null, nullable: true })
  phone: string;

  @Column({ default: null, nullable: true, length: 256 })
  email: string;

  @Column()
  created_at: number;
}

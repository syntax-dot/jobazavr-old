import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Citizenships } from './citizenships.entity';

@Index('user_id', ['user_id'], {})
@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ length: 2 })
  platform: string;

  @Column({ length: 256 })
  name: string;

  @Column({ length: 11, default: null, nullable: true })
  phone: string;

  @Column({ default: null, nullable: true })
  age: number;

  @Column({ default: 0 })
  sex: number;

  @Column({ default: null, nullable: true })
  city_id: number;

  @Column({ default: null, nullable: true })
  @ManyToOne(() => Citizenships, (citizenships) => citizenships.id)
  @JoinColumn({ name: 'citizenship_id' })
  citizenship_id: number;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: true })
  onboarding: boolean;

  @Column()
  joined_at: number;
}

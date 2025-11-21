import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('auth_tokens')
export class AuthTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ length: 512 })
  refresh_token: string;

  @Column()
  created_at: number;
}

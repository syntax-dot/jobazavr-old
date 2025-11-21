import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Jobs } from './jobs.entity';
import { Users } from './users.entity';

@Entity('jobs_favorites')
export class JobsFavorites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column()
  @ManyToOne(() => Jobs, (job) => job.id)
  @JoinColumn({ name: 'job_id' })
  job_id: number;

  @Column()
  created_at: number;
}

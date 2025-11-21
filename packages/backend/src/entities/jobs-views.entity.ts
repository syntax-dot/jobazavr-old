import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Jobs } from './jobs.entity';

@Entity('jobs_views')
export class JobsViews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Jobs, (job) => job.id)
  @JoinColumn({ name: 'job_id' })
  job_id: number;

  @Column()
  viewed_at: number;
}

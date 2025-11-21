import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Cities } from './cities.entity';

@Entity('jobs')
@Index('title', ['title'], {})
@Index('description', ['description'], {})
export class Jobs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  external_company_id: number | null;

  @Column({ nullable: true, default: null })
  external_job_id: number | null;

  @Column()
  @ManyToOne(() => Cities, (city) => city.id)
  @JoinColumn({ name: 'city_id' })
  city_id: number | null;

  @Column({ length: 256 })
  address: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0.0,
    nullable: true,
  })
  latitude: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0.0,
    nullable: true,
  })
  longitude: number;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 256 })
  description: string;

  @Column({ length: 4096 })
  terms: string;

  @Column({ default: null, nullable: true, length: 64 })
  salary: string;

  @Column()
  created_at: number;
}

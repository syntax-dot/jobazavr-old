import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('uploaded_files')
export class UploadedFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by: number;

  @Column({ length: 256 })
  path: string;

  @Column()
  created_at: number;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('uploaded_files')
export class UploadedFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  path: string;

  @Column()
  created_at: number;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logos')
export class Logos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 256 })
  path: string;
}

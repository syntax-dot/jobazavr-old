import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banners')
export class Banners {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  title: string;

  @Column({ length: 1024 })
  path: string;
}

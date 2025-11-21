import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('citizenships')
export class Citizenships {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  title: string;
}

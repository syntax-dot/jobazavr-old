import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('codes')
export class Codes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 11 })
  phone: string;

  @Column({ length: 6 })
  code: string;

  @Column()
  sent_at: number;
}

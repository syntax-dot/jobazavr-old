import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('cities')
@Index('title', ['title'], {})
export class Cities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  title: string;

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
}

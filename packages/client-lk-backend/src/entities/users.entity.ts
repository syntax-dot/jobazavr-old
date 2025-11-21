import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, nullable: true, default: null })
  organization_name: string;

  @Column({ length: 11, default: null, nullable: true })
  phone: string;

  @Column({ default: false })
  is_admin: boolean;

  @Column()
  updated_at: number;

  @Column()
  joined_at: number;
}

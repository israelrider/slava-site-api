import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Table name will be "users"
export class User {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({
    length: 60,
  })
  name: string;

  @Column({
    unique: true,
    length: 255,
  })
  email: string;

  @Column({
    length: 20,
  })
  role: string;

  @Column({
    length: 255,
  })
  password: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Table name will be "users"
export class User {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ length: 255 })
  password: string;
}

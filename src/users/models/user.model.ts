import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Role } from '@/iam/enums/roles.enum';

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
    default: Role.Customer,
  })
  role: string;

  @Column({
    length: 255,
    // Ensure password is not selected by default in queries.
    select: false,
  })
  password: string;

  // This column will be automatically set on creation.
  @CreateDateColumn()
  createdAt: Date;

  // This column will be automatically updated on every save.
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
  })
  rating: number;

  // TODO: Uncomment cascade relation when Diary module is ready.
  /*
  @OneToOne(() => Diary, (diary: Diary) => diary.user, {
    // Ensures TypeORM saves/updates related entity.
    cascade: ['remove'],
  })
  diary: Diary;
  */
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';

import { Role } from '@/iam/enums/roles.enum';
import { Diary } from '@/diary/models/diary.model';
import { Feedback } from '@/feedback/models/feedback.model';

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
    type: "tinyint",
    width: 1,
    unsigned: true,
    default: 0,
  })
  isEmailConfirmed: boolean;

  /*
  @Column({
    nullable: true,
  })
  verificationToken: string;
  */

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

  @OneToOne(() => Diary, (diary: Diary) => diary.user)
  diary: Diary;

  @OneToMany(() => Feedback, (feedback: Feedback) => feedback.user)
  feedback: Feedback;
}

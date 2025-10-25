import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { User } from '@/users/models/user.model';

// Table name will be "diary"
@Entity('diary')
export class Diary {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  data: object;

  // This column will be automatically set on creation.
  @CreateDateColumn()
  createdAt: Date;

  // This column will be automatically updated on every save.
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User)
  // This decorator is crucial for one-to-one relationships to define the owning side
  @JoinColumn()
  user: User;
}

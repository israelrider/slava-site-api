import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '@/users/models/user.model';

// Table name will be "feedback"
@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string | null;

  // This column will be automatically set on creation.
  @CreateDateColumn()
  createdAt: Date;

  // This column will be automatically updated on every save.
  @UpdateDateColumn()
  updatedAt: Date;

  // Ensures TypeORM saves/updates related entity.
  @ManyToOne(() => User, (user: User) => user.feedback, { onDelete: 'CASCADE' })
  // This decorator is crucial for many-to-one relationships to define the owning side.
  @JoinColumn({ name: 'userId' })
  user: User;
}

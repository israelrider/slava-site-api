import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { User } from '@/users/models/user.model';
import { DiaryDataDto } from '@/diary/dto/diary-data.dto';

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
  data: DiaryDataDto | null;

  // This column will be automatically set on creation.
  @CreateDateColumn()
  createdAt: Date;

  // This column will be automatically updated on every save.
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user: User) => user.diary)
  // This decorator is crucial for one-to-one relationships to define the owning side
  @JoinColumn()
  user: User;
}

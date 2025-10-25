import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
    select: false,
  })
  password: string;

  // This column will be automatically set on creation.
  @CreateDateColumn()
  createdAt: Date;

  // This column will be automatically updated on every save.
  @UpdateDateColumn()
  updatedAt: Date;

  // TODO: Uncomment cascade relation when Diary module is ready.
  /*
  @OneToOne(() => Diary, (diary: Diary) => diary.user, {
    // Ensures TypeORM saves/updates related entity.
    cascade: ['remove'],
  })
  diary: Diary;
  */
}

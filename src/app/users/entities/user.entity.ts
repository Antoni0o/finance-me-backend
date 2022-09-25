import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { hashSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { AutoMap } from '@automapper/classes';

@Entity()
export class User {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @AutoMap()
  @Column({ nullable: false })
  name: string;

  @AutoMap()
  @Column({ nullable: false, unique: true })
  email: string;

  @AutoMap()
  @Column({ nullable: false })
  password: string;

  @AutoMap()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  created_at: Date;

  @AutoMap()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  constructor(user?: Partial<User>) {
    this.id = user?.id;
    this.name = user?.id;
    this.email = user?.email;
    this.password = user?.password;
    this.created_at = user?.created_at;
    this.updatedAt = user?.updatedAt;
  }

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 8);
  }
  createUuid() {
    this.id = uuid();
  }
}

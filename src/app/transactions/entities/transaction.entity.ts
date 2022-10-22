import { AutoMap } from "@automapper/classes";
import { User } from "src/app/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense"
}

@Entity()
export class Transaction {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @AutoMap()
  @Column({ nullable: false })
  description: string;

  @AutoMap()
  @Column({ nullable: false })
  type: TransactionType;

  @AutoMap()
  @Column({ nullable: false })
  amount: number;

  @AutoMap()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User

  constructor(transaction?: Partial<Transaction>) {
    this.id = transaction?.id;
    this.description = transaction?.description;
    this.type = transaction?.type;
    this.createdAt = transaction?.createdAt;
    this.updatedAt = transaction?.updatedAt;
  }
}

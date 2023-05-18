import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";

@Entity()
export class GoldenThought extends BaseEntity {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column({
    nullable: false,
  })
  value: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ default: false })
  isDone: boolean;
}

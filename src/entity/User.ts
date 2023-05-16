import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import Role from "../utils/Role";
import { GoldenThought } from "./GoldenThought";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    unique: true,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column()
  password: string;

  @Column({
    transformer: {
      to: (value: string) => {
        if (!value) {
          return value;
        }
        const lowerCaseValue = value.toLowerCase();
        return lowerCaseValue.charAt(0).toUpperCase() + lowerCaseValue.slice(1);
      },
      from: (value: string) => value,
    },
  })
  name: string;

  async verifyPassword(givenPassword: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, this.password);
  }

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
}

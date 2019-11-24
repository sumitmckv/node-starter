import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

export default class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  private id!: string;

  @CreateDateColumn({type: "timestamp"})
  private createdAt!: Date;

  @UpdateDateColumn({type: "timestamp"})
  private updatedAt!: Date;
}   

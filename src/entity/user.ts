import {Entity, Column} from "typeorm";
import BaseEntity from '../base/entity';

@Entity()
export default class User extends BaseEntity {
  @Column("varchar", { length: 50 })
  private firstName!: string;

  @Column("varchar", { length: 50 })
  private lastName!: string;

  @Column("date")
  private dob!: Date;

  @Column("jsonb", {nullable: true})
  private info?: any;
}

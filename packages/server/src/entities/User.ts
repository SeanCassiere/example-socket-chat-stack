import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid", { name: "user_id" })
	userId: string;

	@Column("text", { unique: true })
	username: string;

	@Column("varchar", { name: "first_name" })
	firstName: string;

	@Column("varchar", { name: "last_name" })
	lastName: string;

	@Column("varchar")
	password: string;
}

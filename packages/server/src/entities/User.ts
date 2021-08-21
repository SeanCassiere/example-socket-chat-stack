import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid", { name: "user_id" })
	userId: string;

	@Column("text", { unique: true })
	username: string;

	@Column({ name: "first_name" })
	firstName: string;

	@Column({ name: "last_name" })
	lastName: string;

	@Column()
	password: string;
}

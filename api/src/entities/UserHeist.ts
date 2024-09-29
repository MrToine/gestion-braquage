import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Heist } from "./Heist";
import { User } from "./User";

@Entity()
export class UserHeist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userHeists)
    user: User;

    @ManyToOne(() => Heist, heist => heist.userHeists, {onDelete: 'CASCADE'})
    heist: Heist;

    @Column()
    createdAt: Date;
}

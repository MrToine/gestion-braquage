import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserHeist } from "./UserHeist";

@Entity()
export class Heist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    cost: number;

    @Column()
    rewardMoney: number;

    @Column({nullable: true})
    totalAchieved: number;

    @Column({nullable: true})
    lastUserAchieved: string;

    @OneToMany(() => UserHeist, userHeist => userHeist.heist, {onDelete: 'CASCADE'})
    userHeists: UserHeist[];
}
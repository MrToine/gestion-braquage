import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post";
import { UserHeist } from "./UserHeist";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;
    
    @Column()
    login: string;

    @Column()
    password: string;

    @Column({nullable: true})
    biography: string;

    @Column({nullable: true})
    phoneNumber: string;

    @Column()
    createdAt: Date;

    @Column({nullable: true})
    updatedAt: Date;

    @Column({nullable: true})
    lastConnection: Date;

    @Column({default: false})
    isConnected: boolean;

    @Column({default: true})
    isActive: boolean;

    @Column({default: "user"})
    role: string;

    @OneToMany(() => UserHeist, userHeist => userHeist.user)
    userHeists: UserHeist[];

    @ManyToOne(() => Post, post => post.user)
    posts: Post[];
}
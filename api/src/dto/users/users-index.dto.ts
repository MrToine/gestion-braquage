import { User } from "src/entities/User";
import { HeistIndexDTO } from "../heists/heists-index.dto";
import { UserHeist } from "src/entities/UserHeist";

function ucfirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export class UserHeistDTO {
    name: string;
    date: Date;

    constructor(userHeist: UserHeist) {
        this.name = userHeist.heist.name;
        this.date = userHeist.createdAt;
    }
}

export class UsersSimpleDTO {
    id: number;
    firstname: string;
    lastname: string;
    totalHeists: number; // Concerne un braquage en particulier

    constructor(user: User) {
        this.id = user.id;
        this.firstname = ucfirst(user.firstname);
        this.lastname = user.lastname.toUpperCase();
        this.totalHeists = user.userHeists ? user.userHeists.length : 0;
    }
}

export class UsersIndexDTO {
    id: number;
    firstname: string;
    lastname: string;
    biography: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
    lastConnection: Date;
    isConnected: boolean;
    heists: UserHeistDTO[];
    totalHeists: number;
    totalRewards: number;
    totalCosted: number;
    isActive: boolean;
    role: string;

    constructor(user: User) {
        this.id = user.id;
        this.firstname = ucfirst(user.firstname);
        this.lastname = user.lastname.toUpperCase();
        this.biography = user.biography;
        this.phoneNumber = user.phoneNumber
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.lastConnection = user.lastConnection;
        this.isConnected = user.isConnected;
        this.heists = user.userHeists ? user.userHeists.map(userHeist => new UserHeistDTO(userHeist)): [];
        this.totalHeists = user.userHeists ? user.userHeists.length : 0;
        this.totalRewards = user.userHeists ? user.userHeists.reduce((acc, userHeist) => acc + userHeist.heist.rewardMoney, 0) : 0;
        this.totalCosted = user.userHeists ? user.userHeists.reduce((acc, userHeist) => acc + userHeist.heist.cost, 0) : 0;
        this.isActive = user.isActive;
        this.role = user.role;
    }
}
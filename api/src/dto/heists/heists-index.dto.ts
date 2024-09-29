import { Heist } from "src/entities/Heist";
import { UsersSimpleDTO } from "../users/users-index.dto";

export class HeistIndexDTO {
    id: number;
    name: string;
    cost: number;
    rewardMoney: number;
    totalAchieved: number;
    lastUserAchieved: string;
    achievedBy: UsersSimpleDTO[];

    constructor(heist: Heist) {
        this.id = heist.id;
        this.name = heist.name;
        this.cost = heist.cost;
        this.rewardMoney = heist.rewardMoney;
        this.totalAchieved = heist.totalAchieved;
        this.lastUserAchieved = heist.lastUserAchieved;
        // On récupère les infos des utilisateurs qui ont réalisé le braquage. Si un utilisateur a réalisé plusieurs braquages, on récupère ses infos une seule fois mais on indique le nombre de braquages réalisés.
        this.achievedBy = heist.userHeists ? heist.userHeists.reduce((acc, userHeist) => {
            const user = acc.find(user => user.id === userHeist.user.id);
            if(user) {
                user.totalHeists++;
            } else {
                acc.push(new UsersSimpleDTO(userHeist.user));
            }
            return acc;
        }, []) : [];
    }
}
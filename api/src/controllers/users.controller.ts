import { Body, Controller, Get, Param, Patch, Post, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersIndexDTO } from "src/dto/users/users-index.dto";
import { Heist } from "src/entities/Heist";
import { User } from "src/entities/User";
import { UserHeist } from "src/entities/UserHeist";
import { Repository } from "typeorm";

@Controller('users')
export class UsersController {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserHeist)
        private userHeistRepository: Repository<UserHeist>,
        @InjectRepository(Heist)
        private heistRepository: Repository<Heist>,
        private jwtService: JwtService
    ) {}

    @Get()
    async getAll() {
        const users = await this.userRepository.find({
            relations: ['userHeists', 'userHeists.heist']
        });

        return users.map(user => new UsersIndexDTO(user));
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: id
            },
            relations: ['userHeists', 'userHeists.heist']
        })
        
        if(!user) {
            return { message: 'Utilisateur non trouvé' };
        }
        
        return new UsersIndexDTO(user)
    }
    
    @Post('/create')
    async create(@Body() form: User) {
        const user = {
            ...form,
            login: form.firstname[0] + form.lastname,
            createdAt: new Date(),
         }
         
         if (!user) {
             throw new Error('User not found');
            }
            
            return await this.userRepository.save(user);         
    }

    @Patch('/role/:id')
    async updateRole(@Param('id') id: number, @Body() form: User) {
        const user = await this.userRepository.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        user.role = form.role;

        return await this.userRepository.save(user);
    }
        
    @Patch('/:id')
    async update(@Param('id') id: number, @Body() form: User) {
        const user = await this.userRepository.findOne({
            where: {
                id: id
            }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        user.login = form.login;
        user.phoneNumber = form.phoneNumber;
        user.biography = form.biography;
        user.isActive = form.isActive;
        user.updatedAt = new Date();
        
        return await this.userRepository.save(user);
    }
    
    @Post(':user_id/heist/:heist_id')
    async joinHeist(@Param('user_id') user_id: number, @Param('heist_id') heist_id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id: user_id
            },
            relations: ['userHeists']
        });

        if (!user) {
            throw new Error('User not found');
        }

        const heist = await this.heistRepository.findOne({
            where: {
                id: heist_id
            }
        });

        if (!heist) {
            throw new Error('Heist not found');
        }
    
        const userHeist = new UserHeist();
        userHeist.user = user;
        userHeist.heist = heist;
        userHeist.createdAt = new Date();

        heist.totalAchieved += 1;
        heist.lastUserAchieved = `${user.firstname} ${user.lastname}`;

        await this.heistRepository.save(heist);

        return await this.userHeistRepository.save(userHeist);
    }


    @Post('/:login')
    async login(@Body() form: {login: string, password: string}) {
        const user = await this.userRepository.findOne({
            where: {
                login: form.login,
                password: form.password
            }
        });

        if (!user) {
            throw new UnauthorizedException('Connexion échouée. Pseudo ou mot de passe incorrect.');
        }

        user.isConnected = true;
        user.lastConnection = new Date();

        await this.userRepository.save(user);

        const payload = { sub: user.id, username: user.login };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Connexion réussie',
            user: new UsersIndexDTO(user),
            token: token,
            role: user.role
        };
    }

    @Post('/:login/logout')
    async logout(@Param('login') login: string) {
        const user = await this.userRepository.findOne({
            where: {
                login: login
            }
        });

        if (!user) {
            throw new UnauthorizedException('Utilisateur non trouvé');
        }

        user.isConnected = false;

        await this.userRepository.save(user);

        return { message: 'Déconnexion réussie' };
    }
}
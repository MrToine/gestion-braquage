import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HeistIndexDTO } from "src/dto/heists/heists-index.dto";
import { Heist } from "src/entities/Heist";
import { Repository } from "typeorm";

@Controller('heists')
export class HeistsController {
    constructor(
        @InjectRepository(Heist)
        private heistRepository: Repository<Heist>
    ) {}

    @Get()
    async getAll() {
        const heists = await this.heistRepository.find();
        return heists.map(heist => new HeistIndexDTO(heist));
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        const heist = await this.heistRepository.findOne({
            where: {
                id: id
            },
            relations: ['userHeists', 'userHeists.user']
        })

        if (!heist) {
            throw new Error('Heist not found');
        }

        return new HeistIndexDTO(heist);
    }

    @Post('/create')
    async create(@Body() form: Heist) {
        const heist = {
            ...form,
            createdAt: new Date(),
         }
         
         if (!heist) {
            throw new Error('Heist not found');
         }

        return await this.heistRepository.save(heist);         
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        const heist = await this.heistRepository.findOne({
            where: {
                id: id
            }
        })

        if (!heist) {
            throw new Error('Heist not found');
        }

        try {
            await this.heistRepository.delete(id);
            return { message: 'Heist deleted successfully' };
        } catch (error) {
            throw new HttpException('Failed to delete heist due to foreign key constraint', HttpStatus.BAD_REQUEST);
        }
    }
}
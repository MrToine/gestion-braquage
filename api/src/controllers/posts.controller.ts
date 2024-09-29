import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostDTO } from "src/dto/posts/posts-index.dto";
import { Post as webPost } from "src/entities/Post";
import { User } from "src/entities/User";
import { Repository } from "typeorm";

@Controller('posts')
export class PostsController {
    constructor(
        @InjectRepository(webPost)
        private postRepository: Repository<webPost>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    @Get()
    async getAll() {
        const posts = await this.postRepository.find(
            { relations: ['user'] }
        );
        return posts.map(post => new PostDTO(post));
    }

    @Get('/:id')
    async getOne(id: number) {
        const post = await this.postRepository.findOne({
            where: {
                id: id
            },
            relations: ['user']
        });

        if (!post) {
            throw new Error('Post not found');
        }

        return new PostDTO(post);
    }

    @Post('/create')
    async create(@Body() form: webPost) {
        const newPost = {
            ...form,
            type: 'actus',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        if (!newPost) {
            throw new Error('Post not found');
        }

        return await this.postRepository.save(newPost);
    }

    @Patch('/:id')
    async update(id: number, @Body() post: webPost) {
        console.log('update', id, post);
        const updatedPost = await this.postRepository.findOne({
            where: {
                id: id
            }
        });

        if (!updatedPost) {
            throw new Error('Post not found');
        }

        updatedPost.content = post.content;
        updatedPost.updatedAt = new Date();

        return await this.postRepository.save(updatedPost);
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: number) {
        const post = await this.postRepository.findOne({
            where: {
                id: id
            }
        });

        if (!post) {
            throw new Error('Post not found');
        }

        return await this.postRepository.delete(id);
    }
}
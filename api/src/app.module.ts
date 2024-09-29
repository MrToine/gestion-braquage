import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/User';
import { Heist } from './entities/Heist';
import { HeistsController } from './controllers/heists.controller';
import { UserHeist } from './entities/UserHeist';
import { Post } from './entities/Post';
import { PostsController } from './controllers/posts.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/db.sqlite',
      entities: [User, Heist, UserHeist, Post],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Heist, UserHeist, Post]),
    JwtModule.register({
      secret: 'rezgfvz5efverggher5cfzef5ze4rfezfzec81efzer8gf4rez',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController, HeistsController, PostsController],
  providers: [],
})
export class AppModule {}

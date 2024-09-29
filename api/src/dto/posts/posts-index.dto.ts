import { Post } from "src/entities/Post";

export class PostDTO {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    type: string;
    
    constructor(post: Post) {
        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
        this.isActive = post.isActive;
        this.type = post.type;
    }
}
export class PostsListDTO {
    posts: PostDTO[];
    count: number;

    constructor(posts: Post[]) {
        this.posts = posts.map(post => new PostDTO(post));
        this.count = posts.length;
    }
}
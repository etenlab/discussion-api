import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from 'src/posts/post.model';

@Entity()
@ObjectType()
export class Reaction {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  post_id: number;

  @Column()
  @Field(() => String, { nullable: false })
  user_id: string;

  @Column()
  @Field(() => String, { nullable: false })
  content: string;
}

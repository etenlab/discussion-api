import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Discussion } from 'src/discussions/discussion.model';

@Entity(`posts`)
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @ManyToOne(() => Discussion, (discussion) => discussion.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discussion_id' })
  discussion: Discussion;

  @Column()
  discussion_id: number;

  @Column()
  @Field(() => String, { nullable: false })
  user_id: string;

  @Column()
  @Field(() => String)
  quill_text: string;

  @Column()
  @Field(() => String)
  plain_text: string;

  @Column()
  @Field(() => String, { nullable: false, defaultValue: 'simple' })
  postgres_language: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;
}

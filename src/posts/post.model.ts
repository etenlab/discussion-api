import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Discussion } from 'src/discussions/discussion.model';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Field()
  @ManyToOne(type => Discussion, (discussion) => discussion.id)
  @JoinColumn({name: 'discussion_id'})
  discussion: Discussion;

  @Column()
  discussion_id: number;

  @Column()
  @Field(type => String, { nullable: false })
  user_id: string;

  @Column()
  @Field(type => String)
  quill_text: string;

  @Column()
  @Field(type => String)
  plain_text: string;

  @Column()
  @Field(type => String, { nullable: false, defaultValue: 'simple' })
  postgres_language: string;

  @Column()
  @Field(type => Date)
  created_at: Date;
}

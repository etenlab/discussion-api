import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { File } from './file.model';
import { Post } from './post.model';

@Entity(`relationship_post_file`)
@ObjectType()
export class RelationshipPostFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  post_id: number;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  file_id: number;

  @OneToOne(() => File, (file) => file.id)
  @JoinColumn({
    name: 'file_id',
  })
  file: File;
}

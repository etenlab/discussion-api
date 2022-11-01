import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(`users`)
@ObjectType()
export class Discussion {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ default: 0 })
  @Field(() => Int)
  app: number;

  @Column({ default: 0 })
  @Field(() => Int)
  org: number;

  @Column()
  @Field({ nullable: false })
  table_name: string;

  @Column()
  @Field(() => Int, { nullable: false })
  row: number;
}

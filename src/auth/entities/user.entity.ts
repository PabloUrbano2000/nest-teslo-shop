import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: '7da63d6c-843d-46f2-b352-b2fadf0e2e27',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test01@mailinator.com',
    description: 'User Email',
    uniqueItems: true,
    nullable: false,
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'ElMaldy01',
    description: 'User Password',
    nullable: false,
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'Pablo Urbano',
    description: 'User Fullname',
    nullable: false,
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'User Status',
    default: true,
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'User Roles',
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}

// import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
// Partial Type de swagger para poder documentar
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

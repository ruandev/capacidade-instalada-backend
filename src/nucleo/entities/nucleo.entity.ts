import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Nucleo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;
}

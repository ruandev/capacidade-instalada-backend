import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'nucleos' })
export class Nucleo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'series' })
export class Serie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;
}

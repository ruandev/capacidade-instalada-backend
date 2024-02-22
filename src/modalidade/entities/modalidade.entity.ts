import { Escola } from '../../escola/entities/escola.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'modalidades' })
export class Modalidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  @ManyToMany(() => Escola, (escola) => escola.modalidades)
  escolas: Escola[];
}

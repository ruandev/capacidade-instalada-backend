import { Escola } from '../../escola/entities/escola.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'nucleos' })
export class Nucleo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Escola, (escola) => escola.nucleo)
  escolas: Escola[];
}

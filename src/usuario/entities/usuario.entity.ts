import { Role } from '../../auth/role.enum';
import { Escola } from '../../escola/entities/escola.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'usuarios', orderBy: { nome: 'ASC' } })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ type: 'text' })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({ default: true })
  ativo: boolean;

  @ManyToOne(() => Escola, (escola) => escola.usuarios, { nullable: true })
  @JoinColumn()
  escola?: Escola;

  static comId(id: string) {
    const usuario = new Usuario();

    usuario.id = id;

    return usuario;
  }
}

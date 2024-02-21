import { Role } from '../../auth/role.enum';
import { Escola } from '../../escola/entities/escola.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Escola, (escola) => escola.id, { nullable: true })
  @JoinColumn({ name: 'escola_id' })
  escola?: Escola;
}

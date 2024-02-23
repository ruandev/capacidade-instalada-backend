import { Usuario } from '../../usuario/entities/usuario.entity';
import { Nucleo } from '../../nucleo/entities/nucleo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Modalidade } from '../../modalidade/entities/modalidade.entity';
import { Sala } from '../../sala/entities/sala.entity';

@Entity({ name: 'escolas' })
export class Escola {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column()
  diretora: string;

  @Column({ nullable: true })
  vicediretora: string;

  @Column()
  coordenadora: string;

  @Column()
  secretaria: string;

  @ManyToOne(() => Nucleo, (nucleo) => nucleo.id)
  @JoinColumn()
  nucleo: Nucleo;

  @OneToMany(() => Usuario, (usuario) => usuario.escola)
  usuarios: Usuario[];

  @ManyToMany(() => Modalidade, (modalidade) => modalidade.escolas)
  @JoinTable({ name: 'escola_modalidade' })
  modalidades: Modalidade[];

  @OneToMany(() => Sala, (sala) => sala.escola)
  salas: Sala[];
}

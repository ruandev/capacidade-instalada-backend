import { Usuario } from '../../usuario/entities/usuario.entity';
import { Nucleo } from '../../nucleo/entities/nucleo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'escolas' })
export class Escola {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column()
  diretora: string;

  @Column({ nullable: true })
  vice_diretora: string;

  @Column()
  coordenadora: string;

  @Column()
  secretaria: string;

  @ManyToOne(() => Nucleo, (nucleo) => nucleo.id)
  @JoinColumn({ name: 'nucleo_id' })
  nucleo: Nucleo;

  @OneToMany(() => Usuario, (usuario) => usuario.escola)
  usuarios: Usuario[];
}

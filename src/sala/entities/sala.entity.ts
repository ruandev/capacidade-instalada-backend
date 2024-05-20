import { Escola } from '../../escola/entities/escola.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Turno } from './turno.enum';
import { Serie } from '../../serie/entities/serie.entity';

@Entity({ name: 'salas' })
@Unique(['numero', 'turno', 'escola'])
export class Sala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numero: number;

  @Column({
    type: 'enum',
    enum: Turno,
  })
  turno: Turno;

  @Column()
  capacidade: number;

  @Column()
  matriculaInicial: number;

  @Column({ default: 0 })
  especiais: number;

  @Column({ default: 0 })
  matriculaCancelada: number;

  @Column({ default: 0 })
  transferidos: number;

  @Column({ default: 0 })
  evadidos: number;

  @Column({ default: 0 })
  matriculaEfetiva: number;

  @Column({ default: 0 })
  naoRenovaram: number;

  @Column({ default: 0 })
  intraRede: number;

  @Column({ default: 0 })
  projecao: number;

  @Column()
  professorPrincipal: string;

  @Column({ nullable: true })
  professorSecundario?: string;

  @Column({ default: true })
  ativo: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Escola, (escola) => escola.salas)
  escola: Escola;

  @ManyToOne(() => Serie)
  serie: Serie;

  static comId(id: string) {
    const sala = new Sala();

    sala.id = id;

    return sala;
  }
}

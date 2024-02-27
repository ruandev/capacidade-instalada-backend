import { Sala } from '../../sala/entities/sala.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ orderBy: { createdAt: 'DESC' } })
export class HistoricoAlteracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campo: string;

  @Column()
  valorAntigo: string;

  @Column()
  valorNovo: string;

  @Column({ type: 'uuid', unique: true })
  flowId: string;

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @ManyToOne(() => Sala)
  @JoinColumn()
  sala: Sala;

  @CreateDateColumn()
  createdAt: Date;
}

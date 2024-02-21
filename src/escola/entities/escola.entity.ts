import { Nucleo } from '../../nucleo/entities/nucleo.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}

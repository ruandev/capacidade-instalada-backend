import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'series' })
export class Serie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  static comId(id: string) {
    const serie = new Serie();

    serie.id = id;

    return serie;
  }
}

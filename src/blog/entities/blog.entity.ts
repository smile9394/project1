import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Blog extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public price: number;

  @Column()
  public category: string;
}

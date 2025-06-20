import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class AgreeOfTerm extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.agreeOfTerm)
  public user: User;

  @Column({ default: false })
  public overTwenty: boolean;

  @Column({ default: false })
  public useTerm: boolean;

  @Column({ default: false })
  public personalInfo: boolean;

  @Column({ default: false })
  public marketingAgree: boolean;
}

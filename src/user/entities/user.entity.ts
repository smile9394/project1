import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { AgreeOfTerm } from '../../agree-of-terms/entities/agree-of-term.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column()
  public phone: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @OneToOne(() => AgreeOfTerm, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public agreeOfTerm: AgreeOfTerm;

  @BeforeInsert()
  async beforeSaveFunction() {
    // password 암호화
    const saltValue = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltValue);
    // 프로필 이미지 자동생성
    this.profileImg = gravatar.url(this.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
      protocol: 'https',
    });
  }
}

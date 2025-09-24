import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SignInRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string; // ID 主键

    @Column({ type: 'varchar' })
    userId: string; // 关联的用户ID

    @Column({ type: 'varchar' })
    configId: string; // 关联的签到配置ID

    @Column({ type: 'datetime' })
    signInDate: Date; // 签到日期

    @Column({ type: 'int' })
    pointsEarned: number; // 本次签到所获积分

    @Column({ type: 'boolean', default: false })
    isMakeUp: boolean; // 补签标识符

    @Column({ type: 'int', nullable: true })
    makeUpCost: number; // 补签消耗积分数

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date; // 签到时间
}
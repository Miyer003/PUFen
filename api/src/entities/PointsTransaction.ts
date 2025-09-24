import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PointsTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string; // 流水ID，主键

    @Column()
    userId: string; // 关联的用户ID

    @Column()
    accountId: string; // 关联的积分账户ID

    @Column()
    amount: number; // 积分变动数量（正数为收入，负数为支出）

    @Column({
        type: 'enum',
        enum: ['earn', 'use', 'expire']
    })
    type: 'earn' | 'use' | 'expire'; // 积分变动类型

    @Column({
        type: 'enum',
        enum: ['signin', 'team', 'reward', 'makeup']
    })
    source: 'signin' | 'team' | 'reward' | 'makeup'; // 积分来源/去向

    @Column()
    relatedId: string; // 关联的业务记录ID

    @Column()
    description: string; // 流水描述，如"周一签到"、"补签消耗"

    @Column()
    balanceBefore: number; // 变动前积分余额

    @Column()
    balanceAfter: number; // 变动后积分余额

    @CreateDateColumn()
    createdAt: Date; // 流水创建时间
}
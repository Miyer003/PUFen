import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class RewardRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string; // ID主键

    @Column({ type: 'varchar' })
    userId: string; // 兑换用户ID

    @Column({ type: 'varchar' })
    rewardItemId: string; // 兑换的商品ID

    @Column({ type: 'int' })
    pointsCost: number; // 消耗的积分数

    @Column({ type: 'varchar' })
    couponCode: string; // 生成的优惠券兑换码

    @Column('varchar', { 
        length: 20,
        default: 'pending'
    })
    status: 'pending' | 'completed' | 'cancelled'; // 兑换状态

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date; // 记录创建时间
}
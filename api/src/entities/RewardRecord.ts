import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class RewardRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string; // ID主键

    @Column()
    userId: string; // 兑换用户ID

    @Column()
    rewardItemId: string; // 兑换的商品ID

    @Column()
    pointsCost: number; // 消耗的积分数

    @Column()
    couponCode: string; // 生成的优惠券兑换码

    @Column({
        type: 'enum',
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    })
    status: 'pending' | 'completed' | 'cancelled'; // 兑换状态

    @CreateDateColumn()
    createdAt: Date; // 记录创建时间
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RewardItem {
    @PrimaryGeneratedColumn('uuid')
    id: string; // 商品ID，主键

    @Column({ length: 100 })
    name: string; // 商品名称，如"满29减4优惠券"

    @Column({ type: 'text' })
    description: string; // 商品详细描述

    @Column()
    pointsCost: number; // 兑换所需积分（5/10/15/20/25/30）

    @Column()
    couponType: string; // 优惠券类型，如"满29减4"

    @Column()
    couponValue: number; // 优惠券实际优惠金额

    @Column()
    conditionAmount: number; // 满减条件金额（如29元）

    @Column()
    stock: number; // 库存数量

    @Column()
    stage: number; // 所属阶段（1/2）

    @CreateDateColumn()
    createdAt: Date; // 商品创建时间
}
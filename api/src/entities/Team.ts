import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string; // ID主键

  @Column({ type: 'varchar' })
  captainId: string; // 队长ID

  @Column({ length: 50, type: 'varchar' })
  name: string; // 团队名称，最大长度50字符

  @Column()
  startTime: Date; // 团队创建/开始时间

  @Column()
  endTime: Date; // 团队结束时间（开始时间+3小时）

  @Column({ default: 100, type: 'int' })
  totalPoints: number; // 团队总积分池，固定100分

  @Column({ 
    type: 'enum',
    enum: ['active', 'completed', 'expired'],
    default: 'active'
  })
  status: 'active' | 'completed' | 'expired'; // 团队状态

  @CreateDateColumn()
  createdAt: Date; // 团队创建时间
}
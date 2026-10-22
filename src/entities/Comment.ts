import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from 'typeorm';
import { Task } from './Task';

@Entity('comments')
@Index(['taskId'])
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    content!: string;

    // Many-to-One Relationship: Many comments belong to one task
    @ManyToOne(() => Task, task => task.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'taskId' })
    task!: Task;

    @Column({ type: 'int' })
    taskId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
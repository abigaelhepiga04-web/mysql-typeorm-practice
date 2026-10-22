import { Response, Request } from 'express'; 
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/Task';
import { Comment } from '../entities/Comment';
import { parse } from 'node:path';

const taskRepository = AppDataSource.getRepository(Task);
const commentRepository = AppDataSource.getRepository(Comment);


// 1. Get all comments for a specific task
//2. Create a comment for a specific task
// 3. Delete a comment by its ID

export class CommentController {

    static async getAllComments(req: Request, res: Response) {
        try {
            const comments = await commentRepository.find({
                select: {
                    content: true,
                    taskId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            res.json({
                success: true,
                count: comments.length,
                data: comments
            });
        } catch (error) {
            console.error('Error fetching comments:', error)
            res.status(500).json({
                sucess: 'false',
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to retrive comments'
                }
            });
        }
    }

    static async getUserTasksComment(req: Request, res: Response) {
        
        try {

            const taskIdParam = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
            const taskId = parseInt(taskIdParam, 10);

            if (isNaN(taskId)) {
                return res.status(400).json({
                    success: 'false',
                    error: {
                        code: 'INVALID_TASK_ID',
                        message: 'Task ID must be a number'
                    }
                });
            }

            const task = await taskRepository.findOne( { where: {id : taskId}});
            if (!task) {
                return res.status(404).json({
                    success: 'false',
                    error: {
                        code: 'TASK_NOT_FOUND',
                        message: `Task ID ${taskId} does not exist`
                    }
                });
            }

            const comment = await commentRepository.find({ where: { taskId }});

            res.json({
                success: 'true',
                count: comment.length,
                data: comment
            });

        } catch (error) {
             console.error('Error fetching tasks:', error);
             return res.status(500).json({
                error: {
                    code: 'INTERNAL_SERVER',
                    message: 'Failed to fetch comments'
                }
             });
        }
    }

    static async createComment(req: Request, res: Response) {

        try {

            const taskIdParam = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
            const taskId = parseInt(taskIdParam, 10);
            const { content } = req.body;

            if (isNaN(taskId)) {
                return res.status(400).json({
                    success: 'false',
                    error: {
                        code: 'INVALID_TASK_ID',
                        message: 'Task ID must be a number'
                    }
                });
            }

            const task = await taskRepository.findOne({ where: { id: taskId }});
            if (!task) {
                return res.status(404).json({
                    success: 'false',
                    error: {
                        code: 'TASK_ID_NOT_FOUND',
                        message: `Task ID ${taskId} does not exist`
                    }
                });
            }

            if (!content || typeof content !== 'string') {
                return res.status(400).json({ message: 'Comment content is required and must be a string' });
            }

            // 2. Trim whitespace and check if it's actually empty
            const trimmedContent = content.trim();
            if (trimmedContent === '') {
                return res.status(400).json({ message: 'Comment cannot be empty or just whitespace' });
            }

            // 3. Optional: Set a character limit (e.g., maximum 500 characters)
            if (trimmedContent.length > 500) {
                return res.status(400).json({ message: 'Comment cannot exceed 500 characters' });
            }

            const comment = await commentRepository.create({
                content,
                taskId
            });

            const savedComment = await commentRepository.save(comment);
            res.status(201).json({
                success: 'true',
                message: 'Comment created successfully',
                data: savedComment
            });

        } catch (error) {
            console.error('Error creating comment:', error);
            res.status(500).json({
                success: 'false',
                error: {
                    code: 'INTERNAL_SERVER',
                    message: 'Failed to create a comment'
                }
            });
        }
    }

    static async deleteComment(req: Request, res: Response) {

        try {
            const commentIdParam = Array.isArray(req.params.commentId) ? req.params.commentId[0] : req.params.commentId; 
            const commentId = parseInt(commentIdParam, 10); 

            if (isNaN(commentId)) {
                return res.status(400).json({
                    success: 'false',
                    error: {
                        code: 'INVALID_COMMENT_ID',
                        message: 'Comment ID must be a number'
                    }
                });
            }

            const comment = await commentRepository.findOne({ where: {id: commentId}});
            if (!comment) {
                return res.status(404).json({
                    success: 'false',
                    error: {
                        code: 'COMMENT_NOT_FOUND',
                        message: `Comment with ID ${commentId} does not exist`
                    }
                });
            }

            await commentRepository.remove(comment);
            res.json({
                success: 'true',
                message: 'Comment deleted successfully',
            });

        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({
                success: 'false',
                error: {
                    code: 'INTERNAL_SERVER',
                    message: 'Failed to delete comment'
                }
            });
        }

    }
}
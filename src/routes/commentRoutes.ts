import { Router } from 'express';
import { CommentController } from '../controllers/commentController';

export const commentRoutes = Router();

commentRoutes.get('/tasks/:taskId/comments', CommentController.getUserTasksComment);
commentRoutes.get('/comments', CommentController.getAllComments);
commentRoutes.post('/tasks/:taskId/comments', CommentController.createComment);

commentRoutes.delete('/comments/:commentId', CommentController.deleteComment);
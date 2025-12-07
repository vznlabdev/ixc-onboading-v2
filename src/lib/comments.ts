export interface Comment {
  id: string;
  applicationId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  parentId?: string;
  mentions?: string[];
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
    url: string;
  }>;
  isPinned: boolean;
  reactions?: Record<string, string[]>; // emoji -> userIds
}

class CommentsService {
  private comments: Comment[] = [];

  constructor() {
    this.loadComments();
  }

  private loadComments() {
    if (typeof window !== 'undefined' && localStorage) {
      const stored = localStorage.getItem('applicationComments');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.comments = parsed.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : undefined,
          }));
        } catch (error) {
          console.error('Failed to load comments:', error);
        }
      }
    }
  }

  private saveComments() {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        localStorage.setItem('applicationComments', JSON.stringify(this.comments));
      } catch (error) {
        console.error('Failed to save comments:', error);
      }
    }
  }

  addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'isEdited'>): Comment {
    const newComment: Comment = {
      ...comment,
      id: `COMMENT-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      isEdited: false,
    };
    
    this.comments.push(newComment);
    this.saveComments();
    
    return newComment;
  }

  updateComment(commentId: string, content: string): Comment | null {
    const index = this.comments.findIndex(c => c.id === commentId);
    
    if (index !== -1) {
      this.comments[index] = {
        ...this.comments[index],
        content,
        updatedAt: new Date(),
        isEdited: true,
      };
      
      this.saveComments();
      return this.comments[index];
    }
    
    return null;
  }

  deleteComment(commentId: string): boolean {
    const index = this.comments.findIndex(c => c.id === commentId);
    
    if (index !== -1) {
      this.comments.splice(index, 1);
      this.saveComments();
      return true;
    }
    
    return false;
  }

  getCommentsByApplication(applicationId: string): Comment[] {
    return this.comments
      .filter(c => c.applicationId === applicationId)
      .sort((a, b) => {
        // Pinned comments first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by date (newest first)
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  togglePin(commentId: string): boolean {
    const comment = this.comments.find(c => c.id === commentId);
    
    if (comment) {
      comment.isPinned = !comment.isPinned;
      this.saveComments();
      return comment.isPinned;
    }
    
    return false;
  }

  addReaction(commentId: string, emoji: string, userId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    
    if (comment) {
      if (!comment.reactions) {
        comment.reactions = {};
      }
      
      if (!comment.reactions[emoji]) {
        comment.reactions[emoji] = [];
      }
      
      const userIndex = comment.reactions[emoji].indexOf(userId);
      
      if (userIndex === -1) {
        comment.reactions[emoji].push(userId);
      } else {
        comment.reactions[emoji].splice(userIndex, 1);
        if (comment.reactions[emoji].length === 0) {
          delete comment.reactions[emoji];
        }
      }
      
      this.saveComments();
    }
  }

  searchComments(query: string): Comment[] {
    const lowercaseQuery = query.toLowerCase();
    
    return this.comments.filter(comment => 
      comment.content.toLowerCase().includes(lowercaseQuery) ||
      comment.userName.toLowerCase().includes(lowercaseQuery)
    );
  }

  getRecentComments(limit: number = 10): Comment[] {
    return [...this.comments]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const commentsService = new CommentsService();

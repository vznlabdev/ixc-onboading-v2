'use client';

import React, { useState, useEffect } from 'react';
import { commentsService, type Comment } from '@/lib/comments';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageCircle,
  Send,
  Pin,
  Edit,
  Trash2,
  MoreVertical,
  Reply,
  AtSign,
  Paperclip,
  Smile,
  Clock,
} from 'lucide-react';

interface CommentsPanelProps {
  applicationId: string;
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
}

export default function CommentsPanel({ applicationId, currentUser }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [applicationId]);

  const loadComments = () => {
    const applicationComments = commentsService.getCommentsByApplication(applicationId);
    setComments(applicationComments);
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const comment = commentsService.addComment({
      applicationId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content: newComment,
      parentId: replyingTo || undefined,
      isPinned: false,
    });

    setNewComment('');
    setReplyingTo(null);
    loadComments();
  };

  const handleEdit = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditContent(comment.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingComment && editContent.trim()) {
      commentsService.updateComment(editingComment, editContent);
      setEditingComment(null);
      setEditContent('');
      loadComments();
    }
  };

  const handleDelete = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      commentsService.deleteComment(commentId);
      loadComments();
    }
  };

  const handlePin = (commentId: string) => {
    commentsService.togglePin(commentId);
    loadComments();
  };

  const handleReaction = (commentId: string, emoji: string) => {
    commentsService.addReaction(commentId, emoji, currentUser.id);
    loadComments();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const isOwn = comment.userId === currentUser.id;
    const reactions = comment.reactions || {};

    return (
      <div
        key={comment.id}
        className={`${isReply ? 'ml-12' : ''} ${
          comment.isPinned ? 'border-l-4 border-yellow-400 pl-3' : ''
        }`}
      >
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {comment.userName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-black">{comment.userName}</span>
              <Badge className="text-xs" variant="outline">
                {comment.userRole}
              </Badge>
              {comment.isPinned && (
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {formatTime(comment.createdAt)}
                {comment.isEdited && ' (edited)'}
              </span>
            </div>

            {editingComment === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                
                {Object.keys(reactions).length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {Object.entries(reactions).map(([emoji, userIds]) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(comment.id, emoji)}
                        className={`px-2 py-1 rounded-full text-xs border ${
                          userIds.includes(currentUser.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        } hover:bg-gray-100`}
                      >
                        {emoji} {userIds.length}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-xs text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {['👍', '❤️', '😊', '🎉'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(comment.id, emoji)}
                        className="text-xs hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {(isOwn || currentUser.role === 'admin') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePin(comment.id)}>
                          <Pin className="w-3 h-3 mr-2" />
                          {comment.isPinned ? 'Unpin' : 'Pin'}
                        </DropdownMenuItem>
                        {isOwn && (
                          <>
                            <DropdownMenuItem onClick={() => handleEdit(comment.id)}>
                              <Edit className="w-3 h-3 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(comment.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Render replies */}
        {!isReply && comments
          .filter(c => c.parentId === comment.id)
          .map(reply => renderComment(reply, true))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-semibold text-black">Comments & Notes</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">No comments yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to add a note</p>
            </div>
          ) : (
            comments
              .filter(c => !c.parentId)
              .map(comment => renderComment(comment))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        {replyingTo && (
          <div className="flex items-center justify-between p-2 mb-2 bg-gray-50 rounded text-xs text-gray-600">
            <span>Replying to comment...</span>
            <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-black">
              ✕
            </button>
          </div>
        )}
        
        <div className="flex items-start gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit();
              }
            }}
            placeholder="Add a comment... (Ctrl+Enter to send)"
            className="flex-1 p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
            rows={2}
          />
          <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <button className="text-gray-500 hover:text-black">
            <AtSign className="w-4 h-4" />
          </button>
          <button className="text-gray-500 hover:text-black">
            <Paperclip className="w-4 h-4" />
          </button>
          <button className="text-gray-500 hover:text-black">
            <Smile className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

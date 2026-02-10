import React, { useState } from 'react';
import { Send, Heart, MessageSquare, MoreHorizontal } from 'lucide-react';
import { COMMUNITY_POSTS } from '../constants';
import { CommunityPost } from '../types';

export const Community: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [newPostContent, setNewPostContent] = useState('');

  const handlePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      user: 'Current User',
      content: newPostContent,
      timestamp: new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleCommentFocus = (id: string) => {
    const input = document.getElementById(`comment-input-${id}`);
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Community Hub</h1>
        <p className="text-gray-400">Share updates, ask questions, and connect with neighbors.</p>
      </div>

      {/* Post Input */}
      <div className="bg-[#181b21] rounded-2xl p-4 border border-[#2a2e37]">
        <div className="flex space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#2a2e37] border border-[#3f4552] flex items-center justify-center text-sm font-bold text-white">
            US
          </div>
          <div className="flex-1">
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening in the community? Share an update..." 
              className="w-full bg-transparent text-white placeholder-gray-500 border-none focus:outline-none resize-none min-h-[80px]"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-[#2a2e37] mt-2">
          <button 
            onClick={handlePost}
            disabled={!newPostContent.trim()}
            className={`${newPostContent.trim() ? 'bg-[#6366f1] hover:bg-[#4f46e5]' : 'bg-[#2a2e37] cursor-not-allowed'} text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors`}
          >
            <Send className="w-4 h-4" />
            <span>Post</span>
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#181b21] rounded-2xl border border-[#2a2e37] overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 font-bold text-xs">
                    {post.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{post.user}</h3>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-200 leading-relaxed">{post.content}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{post.likes} Likes</span>
                <span>{post.comments} Comments</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#2a2e37] pt-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors group ${
                    post.isLiked 
                      ? 'text-red-500 bg-red-500/10' 
                      : 'text-gray-400 hover:bg-[#2a2e37] hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-transform group-active:scale-125 ${post.isLiked ? 'fill-current' : 'group-hover:fill-current'}`} />
                  <span>Like</span>
                </button>
                <button 
                  onClick={() => handleCommentFocus(post.id)}
                  className="flex items-center justify-center space-x-2 py-2 hover:bg-[#2a2e37] rounded-lg transition-colors text-gray-400 hover:text-indigo-400"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
            
            <div className="bg-[#13151b] p-4 flex items-center space-x-3 border-t border-[#2a2e37]">
              <div className="w-8 h-8 rounded-full bg-[#2a2e37] flex items-center justify-center text-xs text-white">
                US
              </div>
              <input 
                id={`comment-input-${post.id}`}
                type="text" 
                placeholder="Write a comment..." 
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Heart, MessageSquare, MoreHorizontal, Share2, PenTool, Reply } from 'lucide-react';
import { COMMUNITY_POSTS } from '../constants';
import { CommunityPost } from '../types';
import { BaseCard, CardBody, CardFooter } from './BaseCard';

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface ExtendedPost extends CommunityPost {
  postComments?: Comment[];
}

export const Community: React.FC = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>(COMMUNITY_POSTS.map(p => ({...p, postComments: []})));
  const [newPostContent, setNewPostContent] = useState('');
  const [replyContent, setReplyContent] = useState<{[key: string]: string}>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: ExtendedPost = {
      id: Date.now().toString(),
      user: 'Current User',
      content: newPostContent,
      timestamp: new Date().toLocaleString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      postComments: []
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        const isLiked = !post.isLiked;
        return { ...post, isLiked, likes: isLiked ? post.likes + 1 : post.likes - 1 };
      }
      return post;
    }));
  };

  const handleReply = (postId: string) => {
    const content = replyContent[postId];
    if (!content?.trim()) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1,
          postComments: [...(post.postComments || []), { id: Date.now().toString(), user: 'Vous', content, timestamp: 'À l\'instant' }]
        };
      }
      return post;
    }));
    setReplyContent({...replyContent, [postId]: ''});
    setActiveReplyId(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="relative bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-[2.5rem] p-10 overflow-hidden border border-indigo-500/20">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Community Hub</h1>
        <p className="text-indigo-200/70 text-lg">Connectez-vous avec le Bled.</p>
      </div>

      {/* Input Section using BaseCard */}
      <BaseCard className="p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shrink-0">
            US
          </div>
          <textarea 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Quoi de neuf aujourd'hui ?" 
            className="flex-1 bg-transparent text-white placeholder-gray-600 border-none focus:outline-none resize-none text-lg py-2 h-24"
          />
        </div>
        <div className="flex justify-end pt-4 border-t border-[#2a2e37]/50 mt-2">
          <button 
            onClick={handlePost}
            disabled={!newPostContent.trim()}
            className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-2 ${newPostContent.trim() ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[#2a2e37] text-gray-500 cursor-not-allowed'}`}
          >
            <PenTool className="w-4 h-4" /> Publier
          </button>
        </div>
      </BaseCard>

      {/* Posts Feed using BaseCard */}
      <div className="space-y-6">
        {posts.map((post) => (
          <BaseCard key={post.id}>
            <CardBody>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 font-black">
                    {post.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base hover:text-indigo-400 cursor-pointer transition-colors">{post.user}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer hover:text-white" />
              </div>

              <p className="text-gray-300 leading-relaxed text-lg mb-6 whitespace-pre-wrap">{post.content}</p>

              <CardFooter>
                <div className="flex gap-6">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 transition-all ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}>
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs font-black">{post.likes}</span>
                  </button>
                  <button onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-400 transition-all">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-xs font-black">{post.comments}</span>
                  </button>
                  <Share2 className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-all" />
                </div>
                <button 
                  onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300"
                >
                  Répondre
                </button>
              </CardFooter>

              {/* Comments Section */}
              {(activeReplyId === post.id || (post.postComments && post.postComments.length > 0)) && (
                <div className="mt-6 pt-6 border-t border-[#2a2e37]/30 space-y-4">
                  {post.postComments?.map(comment => (
                    <div key={comment.id} className="flex gap-3 pl-4 border-l-2 border-indigo-500/20">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-[10px] text-purple-400 font-black shrink-0">
                        {comment.user.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="bg-[#181b21] p-3 rounded-2xl flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] font-black text-white uppercase">{comment.user}</span>
                          <span className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-400">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {activeReplyId === post.id && (
                    <div className="flex items-center gap-3 pt-2">
                      <input 
                        type="text" 
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent({...replyContent, [post.id]: e.target.value})}
                        placeholder="Écrire une réponse..." 
                        className="flex-1 bg-[#0f1117] border border-[#2a2e37] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleReply(post.id)}
                      />
                      <button onClick={() => handleReply(post.id)} className="bg-indigo-600 p-2 rounded-xl text-white hover:scale-105 transition-all">
                        <Reply className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </BaseCard>
        ))}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Forum = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/forum_post') 
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching forum posts:', error));
  }, []);

  const handleCommentSubmit = (postId, comment) => {
    axios.post(`/api/forum-posts/${postId}/comments`, { content: comment })
      .then(response => {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, comments: [...post.comments, response.data] } : post
        ));
      })
      .catch(error => console.error('Error submitting comment:', error));
  };

  const handleReaction = (postId, type) => {
    axios.post(`/api/forum-posts/${postId}/reactions`, { type })
      .then(response => {
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, reactions: response.data.reactions } : post
        ));
      })
      .catch(error => console.error('Error reacting to post:', error));
  };

  return (
    <div>
      <h2>Forum Page</h2>
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Posted by: {post.author.username}</p>

          <div className="reactions">
            <button onClick={() => handleReaction(post.id, 'like')}>Like</button>
            <button onClick={() => handleReaction(post.id, 'dislike')}>Dislike</button>
            <p>{post.reactions.like} Likes | {post.reactions.dislike} Dislikes</p>
          </div>

          <div className="comments">
            <h4>Comments</h4>
            {post.comments.map(comment => (
              <p key={comment.id}><strong>{comment.author.username}:</strong> {comment.content}</p>
            ))}
            <CommentForm postId={post.id} onSubmit={handleCommentSubmit} />
          </div>
        </div>
      ))}
    </div>
  );
};

const CommentForm = ({ postId, onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(postId, comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Forum;

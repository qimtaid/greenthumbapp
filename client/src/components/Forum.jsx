import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Divider,
  FormControl,
  Input,
  Textarea,
  useColorModeValue,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get('http://127.0.0.1:5000/forum_post')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching forum posts:', error));
  };

  const handleAddPost = () => {
    axios.post('http://127.0.0.1:5000/forum_post', newPost)
      .then(response => {
        setPosts([...posts, response.data]);
        setNewPost({ title: '', content: '' });
      })
      .catch(error => console.error('Error adding post:', error));
  };

  const handleEditPost = (postId) => {
    axios.put(`http://127.0.0.1:5000/forum_post/${postId}`, newPost)
      .then(response => {
        setPosts(posts.map(post =>
          post.id === postId ? response.data : post
        ));
        setEditingPostId(null);
        setNewPost({ title: '', content: '' });
      })
      .catch(error => console.error('Error editing post:', error));
  };

  const handleDeletePost = (postId) => {
    axios.delete(`http://127.0.0.1:5000/forum_post/${postId}`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== postId));
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  const handleCommentSubmit = (postId, comment) => {
    axios.post(`http://127.0.0.1:5000/forum_post/${postId}/comments`, { content: comment })
      .then(response => {
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, comments: [...post.comments, response.data] } : post
        ));
      })
      .catch(error => console.error('Error submitting comment:', error));
  };

  const handleReaction = (postId, type) => {
    axios.post(`http://127.0.0.1:5000/forum_post/${postId}/reactions`, { type })
      .then(response => {
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, reactions: response.data.reactions } : post
        ));
      })
      .catch(error => console.error('Error reacting to post:', error));
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box maxW="4xl" mx="auto" mt={10} p={4}>
      <Heading mb={6} textAlign="center">Forum</Heading>

      <Box mb={8} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor}>
        <Heading fontSize="lg" mb={4} color={textColor}>Add New Post</Heading>
        <FormControl mb={4}>
          <Input
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            mb={2}
          />
          <Textarea
            placeholder="Post Content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
        </FormControl>
        <Button onClick={editingPostId ? () => handleEditPost(editingPostId) : handleAddPost} colorScheme="teal">
          {editingPostId ? 'Save Changes' : 'Add Post'}
        </Button>
      </Box>

      <VStack spacing={6} align="stretch">
        {posts.map(post => (
          <Box
            key={post.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg={bgColor}
          >
            <HStack justify="space-between">
              <Heading fontSize="xl" mb={2} color={textColor}>{post.title}</Heading>
              <HStack>
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => {
                    setEditingPostId(post.id);
                    setNewPost({ title: post.title, content: post.content });
                  }}
                  size="sm"
                />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleDeletePost(post.id)}
                  size="sm"
                />
              </HStack>
            </HStack>
            <Text mb={4} color={textColor}>{post.content}</Text>
            <Text fontSize="sm" mb={4} color={textColor}>Posted by: {post.author.username}</Text>

            <HStack spacing={4} mb={4}>
              <Button onClick={() => handleReaction(post.id, 'like')} colorScheme="teal" size="sm">
                Like
              </Button>
              <Button onClick={() => handleReaction(post.id, 'dislike')} colorScheme="red" size="sm">
                Dislike
              </Button>
              <Text color={textColor}>
                {post.reactions.like} Likes | {post.reactions.dislike} Dislikes
              </Text>
            </HStack>

            <Divider mb={4} />

            <Box>
              <Heading fontSize="md" mb={3} color={textColor}>Comments</Heading>
              <VStack spacing={3} align="stretch">
                {post.comments.map(comment => (
                  <Text key={comment.id} color={textColor}>
                    <strong>{comment.author.username}:</strong> {comment.content}
                  </Text>
                ))}
              </VStack>
            </Box>

            <CommentForm postId={post.id} onSubmit={handleCommentSubmit} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

const CommentForm = ({ postId, onSubmit }) => {
  const [comment, setComment] = useState('');
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(postId, comment);
      setComment('');
    }
  };

  return (
    <Box as="form" mt={4} onSubmit={handleSubmit}>
      <FormControl>
        <Input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment..."
          bg={bgColor}
          color={textColor}
        />
      </FormControl>
      <Button
        mt={2}
        colorScheme="teal"
        type="submit"
        size="sm"
      >
        Submit
      </Button>
    </Box>
  );
};

export default Forum;

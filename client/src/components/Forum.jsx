import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Input,
    Textarea,
    VStack,
    Heading,
    Text,
    HStack,
    IconButton,
    useToast,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaComments } from 'react-icons/fa';
import {
    fetchForumPosts,
    addForumPost,
    updateForumPost,
    deleteForumPost,
    addComment,
    updateComment,
    deleteComment,
} from '../utils/api';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editPostId, setEditPostId] = useState(null);
    const toast = useToast();

    const loadPosts = async () => {
        try {
            const data = await fetchForumPosts();
            setPosts(data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast({
                    title: 'Unauthorized. Please log in.',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Failed to load posts.',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleAddPost = async () => {
        try {
            await addForumPost(newPost.title, newPost.content);
            setNewPost({ title: '', content: '' });
            loadPosts();
            toast({
                title: 'Post added.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to add post.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUpdatePost = async () => {
        try {
            await updateForumPost(editPostId, newPost.title, newPost.content);
            setNewPost({ title: '', content: '' });
            setIsEditing(false);
            setEditPostId(null);
            loadPosts();
            toast({
                title: 'Post updated.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to update post.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await deleteForumPost(postId);
            loadPosts();
            toast({
                title: 'Post deleted.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to delete post.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEditPost = (post) => {
        setNewPost({ title: post.title, content: post.content });
        setIsEditing(true);
        setEditPostId(post.id);
    };

    const handleCancelEdit = () => {
        setNewPost({ title: '', content: '' });
        setIsEditing(false);
        setEditPostId(null);
    };

    const handleAddComment = async (postId, content) => {
        try {
            await addComment(postId, content);
            loadPosts();
            toast({
                title: 'Comment added.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to add comment.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUpdateComment = async (commentId, content) => {
        try {
            await updateComment(commentId, content);
            loadPosts();
            toast({
                title: 'Comment updated.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to update comment.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            loadPosts();
            toast({
                title: 'Comment deleted.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to delete comment.',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const bgColor = useColorModeValue('gray.50', 'gray.700'); // Background color
    const textColor = useColorModeValue('black', 'white'); // Text color
    const inputBgColor = useColorModeValue('white', 'gray.800'); // Input background color
    const commentBgColor = useColorModeValue('gray.100', 'gray.600'); // Comment background color

    return (
        <Box p={6}>
            <Box
                bg="teal.500"
                color="white"
                p={4}
                mb={6}
                borderRadius="md"
                textAlign="center"
            >
                <Icon as={FaComments} w={10} h={10} mb={3} />
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                    Join the Discussion
                </Text>
                <Text>
                    Welcome to the community forum! Share your thoughts, ask questions, 
                    and connect with others. Feel free to start a discussion or leave a comment 
                    on existing posts.
                </Text>
            </Box>

            <Box mb={6}>
                <VStack spacing={4}>
                    <Input
                        placeholder="Post Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        bg={inputBgColor}
                    />
                    <Textarea
                        placeholder="Post Content"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        bg={inputBgColor}
                    />
                    {isEditing ? (
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleUpdatePost}>
                                Update Post
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit}>
                                Cancel Edit
                            </Button>
                        </HStack>
                    ) : (
                        <Button colorScheme="teal" onClick={handleAddPost}>
                            Add Post
                        </Button>
                    )}
                    <Text color="red.500" mt={2}>Changes can only be made by the owner</Text>
                </VStack>
            </Box>

            <VStack spacing={6}>
                {posts.map((post) => (
                    <Box
                        key={post.id}
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="md"
                        w="100%"
                        bg={bgColor}
                    >
                        <Heading fontSize="xl" color={textColor}>{post.title}</Heading>
                        <Text mt={4} color={textColor}>{post.content}</Text>
                        <HStack mt={4} spacing={4}>
                            <IconButton
                                icon={<EditIcon />}
                                onClick={() => handleEditPost(post)}
                                aria-label="Edit post"
                                size="sm"
                                isDisabled={!post.isOwner}
                            />
                            <IconButton
                                icon={<DeleteIcon />}
                                onClick={() => handleDeletePost(post.id)}
                                aria-label="Delete post"
                                size="sm"
                                colorScheme="red"
                                isDisabled={!post.isOwner}
                            />
                        </HStack>

                        <Box mt={4}>
                            {post.comments.map((comment) => (
                                <Box
                                    key={comment.id}
                                    mt={4}
                                    p={4}
                                    bg={commentBgColor}
                                    borderRadius="md"
                                >
                                    <Text color={textColor}>{comment.content}</Text>
                                    <HStack mt={2} spacing={4}>
                                        <IconButton
                                            icon={<EditIcon />}
                                            onClick={() =>
                                                handleUpdateComment(comment.id, comment.content)
                                            }
                                            aria-label="Edit comment"
                                            size="sm"
                                            isDisabled={!comment.isOwner}
                                        />
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            onClick={() => handleDeleteComment(comment.id)}
                                            aria-label="Delete comment"
                                            size="sm"
                                            colorScheme="red"
                                            isDisabled={!comment.isOwner}
                                        />
                                    </HStack>
                                </Box>
                            ))}

                            <Input
                                mt={4}
                                placeholder="Add a comment..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                        handleAddComment(post.id, e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                bg={inputBgColor}
                            />
                        </Box>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default Forum;

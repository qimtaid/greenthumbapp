import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  IconButton,
  useToast,
  Text,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { 
  fetchForumPosts, 
  addForumPost, 
  updateForumPost, 
  deleteForumPost, 
  fetchComments, 
  addComment
} from '../utils/api'; // Adjust the import

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const { 
    isOpen: isPostAddModalOpen, 
    onOpen: onPostAddOpen, 
    onClose: onPostAddClose 
  } = useDisclosure();

  const { 
    isOpen: isPostEditModalOpen, 
    onOpen: onPostEditOpen, 
    onClose: onPostEditClose 
  } = useDisclosure();

  const { 
    isOpen: isPostDeleteModalOpen, 
    onOpen: onPostDeleteOpen, 
    onClose: onPostDeleteClose 
  } = useDisclosure();

  const { 
    isOpen: isCommentAddModalOpen, 
    onOpen: onCommentAddOpen, 
    onClose: onCommentAddClose 
  } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const postData = await fetchForumPosts();
      setPosts(postData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ title: 'Error fetching posts', status: 'error' });
    }
  };

  const handleAddPost = async () => {
    try {
      await addForumPost(newPost);
      toast({ title: 'Post added', status: 'success' });
      setNewPost({ title: '', content: '' });
      onPostAddClose();
      fetchData();
    } catch (error) {
      console.error('Error adding post:', error);
      toast({ title: 'Error adding post', status: 'error' });
    }
  };

  const handleUpdatePost = async () => {
    try {
      await updateForumPost(currentPost.id, currentPost);
      toast({ title: 'Post updated', status: 'success' });
      setCurrentPost(null);
      onPostEditClose();
      fetchData();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({ title: 'Error updating post', status: 'error' });
    }
  };

  const handleDeletePost = async () => {
    try {
      await deleteForumPost(currentPost.id);
      toast({ title: 'Post deleted', status: 'success' });
      setCurrentPost(null);
      onPostDeleteClose();
      fetchData();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: 'Error deleting post', status: 'error' });
    }
  };

  const handleAddComment = async () => {
    try {
      await addComment(selectedPostId, { content: newComment });
      toast({ title: 'Comment added', status: 'success' });
      setNewComment('');
      onCommentAddClose();
      fetchCommentsData(selectedPostId);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: 'Error adding comment', status: 'error' });
    }
  };

  const fetchCommentsData = async (postId) => {
    try {
      const commentData = await fetchComments(postId);
      setComments(commentData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({ title: 'Error fetching comments', status: 'error' });
    }
  };

  const openPostEditModal = (post) => {
    setCurrentPost(post);
    onPostEditOpen();
  };

  const openPostDeleteModal = (post) => {
    setCurrentPost(post);
    onPostDeleteOpen();
  };

  const openCommentAddModal = (postId) => {
    setSelectedPostId(postId);
    fetchCommentsData(postId);
    onCommentAddOpen();
  };

  return (
    <Box p={4}>
      <Button mb={4} colorScheme="teal" onClick={onPostAddOpen}>
        Add Post
      </Button>

      <Table variant="simple">
        <TableCaption>Forum Posts</TableCaption>
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Content</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Tr key={post.id}>
                <Td>{post.title}</Td>
                <Td>{post.content}</Td>
                <Td>
                  <Button colorScheme="blue" onClick={() => openCommentAddModal(post.id)}>
                    Comments
                  </Button>
                  <IconButton
                    aria-label="Edit post"
                    icon={<FaEdit />}
                    colorScheme="teal"
                    onClick={() => openPostEditModal(post)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete post"
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => openPostDeleteModal(post)}
                  />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="3">No posts found</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Add Post Modal */}
      <Modal isOpen={isPostAddModalOpen} onClose={onPostAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Post</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <FormLabel mt={4}>Content</FormLabel>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddPost}>
              Add Post
            </Button>
            <Button onClick={onPostAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Post Modal */}
      <Modal isOpen={isPostEditModalOpen} onClose={onPostEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={currentPost?.title || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
              />
              <FormLabel mt={4}>Content</FormLabel>
              <Textarea
                value={currentPost?.content || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdatePost}>
              Update Post
            </Button>
            <Button onClick={onPostEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Post Modal */}
      <Modal isOpen={isPostDeleteModalOpen} onClose={onPostDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this post?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeletePost}>
              Delete
            </Button>
            <Button onClick={onPostDeleteClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Comment Modal */}
      <Modal isOpen={isCommentAddModalOpen} onClose={onCommentAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Comment</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Comment</FormLabel>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddComment}>
              Add Comment
            </Button>
            <Button onClick={onCommentAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Comments Section */}
      {selectedPostId && (
        <Box mt={6}>
          <Text fontSize="lg" mb={4}>Comments</Text>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment.id} borderWidth="1px" borderRadius="md" p={4} mb={2}>
                <Text>{comment.content}</Text>
              </Box>
            ))
          ) : (
            <Text>No comments yet.</Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Forum;

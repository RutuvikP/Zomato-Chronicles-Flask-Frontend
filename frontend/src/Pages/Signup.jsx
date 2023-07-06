import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const Signup = () => {
  
  const toast = useToast();
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make a POST request to the backend '/signup' route with formData
    // You can use Axios or the Fetch API for making the request
    // Replace the placeholder URL with your actual backend URL
    fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data as per your requirements
        console.log(data.message);
        toast({
          title: 'Signup Successful',
          description: 'You have successfully signed up.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        // Redirect the user to the desired page after successful signup
        navigate('/')
      })
      .catch((error) => {
        // Handle any errors that occur during the signup process
        console.error('Error:', error);
        toast({
          title: 'Signup Failed',
          description: 'Failed to sign up. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <>
    <Navbar/>
    <Box
      mx="auto"
      my={8}
      p={6}
      maxW={{ base: '90%', md: '500px' }}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Signup
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="role" isRequired>
            <FormLabel>Role</FormLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>
          </FormControl>
          <Button
            colorScheme="blue"
            variant="solid"
            type="submit"
            w="100%"
            _hover={{ bg: 'blue.600' }}
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
    </>
  );
};

export default Signup;

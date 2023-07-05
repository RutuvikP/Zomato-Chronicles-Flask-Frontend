import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      localStorage.setItem('role',JSON.stringify(data.role))

      if (data.message) {
        // Login success
        toast({
          title: 'Login Successful',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/menu')
      } else {
        // Login failed
        toast({
          title: 'Login Failed',
          description: data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      py={8}
      px={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Login
      </Text>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;
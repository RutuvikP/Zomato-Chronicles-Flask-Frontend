import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);
  const role=JSON.parse(localStorage.getItem('role'));

  // Check if the current screen width is mobile
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const handlelogout=()=>{
    localStorage.clear();
    return <Navigate to={'/'}/>
  }

  // Add event listener for window resize
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[]);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding={{ base: '1rem', md: '1rem' }}
      bg="gray.800"
      color="white"
      wrap="wrap"
    >
      <Box>
        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
        Flavor Fusion
        </Text>
      </Box>
      {isMobile ? (
        <>
          <IconButton
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={onToggle}
            variant="solid"
          />
          <Collapse in={isOpen} animateOpacity>
            <Flex
              as="ul"
              listStyleType="none"
              spacing={{ base: '1rem', md: '2rem' }}
              align="center"
              justify="flex-end"
            >
              <Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/menu">Menu</Link>
              </Box>
              <Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/orders">Orders</Link>
              </Box>
              {!role?<Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/">Login</Link>
              </Box>:<Box onClick={handlelogout} as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/">Logout</Link>
              </Box>}
              {!role?<Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/signup">Signup</Link>
              </Box>:""}
            </Flex>
          </Collapse>
        </>
      ) : (
        <Flex
          as="ul"
          listStyleType="none"
          spacing={{ base: '1rem', md: '2rem' }}
          align="center"
          justify="flex-end"
        >
          <Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
            <Link to="/menu">Menu</Link>
          </Box>
          <Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
            <Link to="/orders">Orders</Link>
          </Box>
          {!role?<Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/">Login</Link>
          </Box>:<Box onClick={handlelogout} as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/">Logout</Link>
          </Box>}
          {!role?<Box as="li" mx={{ base: '0.5rem', md: '1rem' }}>
                <Link to="/signup">Signup</Link>
          </Box>:""}
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [update,setUpdate] = useState(false);
  const [availability, setAvailability] = useState('');
  const [image,setImage] = useState('');
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedAvailability, setUpdatedAvailability] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate=useNavigate();
  const toast = useToast();

  // Fetch dishes from the server
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/');
        const data = await response.json();
        console.log(data);
        setDishes(data.menu);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, [updatedPrice,updatedAvailability,update]);

  // Update the price of a dish
  const updatePrice = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/menu/update_dish/${selectedDish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: updatedPrice, availability: updatedAvailability }),
      });

      const data = await response.json();

      if (response.ok) {
        // Price update success
        toast({
          title: 'Dish Updated',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setSelectedDish(null);
        setUpdatedPrice('');
        onClose();
      } else {
        // Price update failed
        toast({
          title: 'Dish Update Failed',
          description: data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Price Update Error:', error);
    }
  };

  const handleAddDish = () => {
    // Perform the necessary actions to add a new dish
    // Send a POST request to the '/menu/add' route with the dish data
    const dishData = {
      name: dishName,
      price: price,
      availability: availability,
      image: image
    };

    axios.post('http://127.0.0.1:5000/menu/add', dishData)
      .then(response => {
        console.log(response.data.message);
        // Reset the form values and close the modal
        toast({
            title: 'Dish Added',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        setDishName('');
        setPrice('');
        setAvailability('');
        setShowAddDishModal(false);
        setUpdate(!update)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePlaceOrder = () =>{
    navigate('/placeorder')
  }

    // Delete a dish
    const deleteDish = async (dishId) => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/menu/remove/${dishId}`, {
            method: 'DELETE',
          });
    
          const data = await response.json();
    
          if (response.ok) {
            // Dish deletion success
            toast({
              title: 'Dish Removed',
              description: data.message,
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setSelectedDish(null);
            setUpdate(!update)
          } else {
            // Dish deletion failed
            toast({
              title: 'Dish Removal Failed',
              description: data.error,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error('Dish Removal Error:', error);
        }
      };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updatePrice();
  };

  // Check if the user is an admin
  const isAdmin = JSON.parse(localStorage.getItem('role')) == 'admin';

  // Render dish cards
  const renderDishCards = () => {
    return dishes.map((dish) => (
      <Box
        key={dish.id}
        m={'auto'}
        maxW="sm"
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        shadow="md"
        p={4}
        mb={4}
      >
        <Image src={dish.image} alt={dish.name} />
        <Text mt={2} fontWeight="bold">
          {dish.name}
        </Text>
        <Text>Price: $ {dish.price}</Text>
        <Text>Availability: {dish.availability=="true" ? 'YES' : 'NO'}</Text>
        {isAdmin && (
            <>
          <Button mt={4} colorScheme="blue" onClick={() => handleEdit(dish)}>
            Edit
          </Button>
          <Button mt={4} colorScheme="red" onClick={() => deleteDish(dish.id)}>
          Delete
        </Button>
        </>
        )}
      </Box>
    ));
  };

  // Handle edit button click
  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setUpdatedPrice(dish.price);
    setUpdatedAvailability(dish.available);
    onOpen();
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Menu
      </Text>
      {isAdmin && (
        <Button onClick={() => setShowAddDishModal(true)} colorScheme="blue" mr={4}>
          Add New Dish
        </Button>
      )}
      {!isAdmin && (
        <Button onClick={handlePlaceOrder} colorScheme="green" mr={4}>
          Place Order
        </Button>
      )}
      {/* Add New Dish Modal */}
      <Modal isOpen={showAddDishModal} onClose={() => setShowAddDishModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Dish</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Dish Name</FormLabel>
              <Input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Dish Image</FormLabel>
              <Input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>
            {isAdmin && (
              <FormControl mt={4}>
                <FormLabel>Availability</FormLabel>
                <Input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddDish}>Add Dish</Button>
            <Button colorScheme="gray" ml={2} onClick={() => setShowAddDishModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {renderDishCards()}
      </Box>
      {selectedDish && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Dish</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter the updated price"
                      value={updatedPrice}
                      onChange={(e) => setUpdatedPrice(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Availability</FormLabel>
                    <select
                      value={updatedAvailability}
                      onChange={(e) => setUpdatedAvailability(e.target.value)}
                    >
                        <option value="">Select Availability</option>
                      <option value={true}>Available</option>
                      <option value={false}>Not Available</option>
                    </select>
                  </FormControl>
                  <Center mt={4}>
                    <Button colorScheme="blue" type="submit">
                      Update
                    </Button>
                  </Center>
                </Stack>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Menu;
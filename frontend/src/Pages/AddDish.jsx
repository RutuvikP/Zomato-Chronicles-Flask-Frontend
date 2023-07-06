import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input, Checkbox, Stack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const AddDish = () => {
  
  const [customerName, setCustomerName] = useState('');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [availableDishes, setAvailableDishes] = useState([]);
  const navigate=useNavigate();
  const toast=useToast();

  useEffect(() => {
    // Fetch available dishes from the backend
    axios.get('http://127.0.0.1:5000/')
      .then(response => {
        const dishes = response.data.data;
        console.log(dishes);
        const availableDishes = dishes.menu.filter(dish => dish.availability=="true");
        setAvailableDishes(availableDishes);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePlaceOrder = () => {
    // Perform the necessary actions to place the order
    // Send a POST request to the '/order/new' route with the order data
    const dishIds = selectedDishes.map(dish => dish.id);
    const orderData = {
      customer_name: customerName,
      customer_email: JSON.parse(localStorage.getItem('email')),
      dish_ids: dishIds.join(',')
    };

    axios.post('http://127.0.0.1:5000/order/new', orderData)
      .then(response => {
        console.log(response.data.message);
        const orderId = response.data.order_id;
        // Redirect the user to the order details page
        navigate('/orders')
        toast({
          title: 'Order Placed !!',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCheckboxChange = (dish) => {
    if (selectedDishes.includes(dish)) {
      setSelectedDishes(selectedDishes.filter(selected => selected !== dish));
    } else {
      setSelectedDishes([...selectedDishes, dish]);
    }
  };

  return (
    <>
    <Navbar/>
    <div style={{margin:'auto', width:'30%'}}>
      <FormControl>
        <FormLabel>Customer Name</FormLabel>
        <Input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Available Dishes</FormLabel>
        <Stack spacing={2}>
          {availableDishes.map(dish => (
            <Checkbox
              key={dish.id}
              value={dish.id}
              onChange={() => handleCheckboxChange(dish)}
            >
              {dish.id}: {dish.name} ${dish.price}
            </Checkbox>
          ))}
        </Stack>
      </FormControl>

      <Button mt={4} colorScheme="blue" onClick={handlePlaceOrder}>
        Place Order
      </Button>
    </div>
    </>
  );
};

export default AddDish;
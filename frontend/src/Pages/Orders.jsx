import React, { useState, useEffect } from 'react';
import { Button, Table, Thead, Tbody, Tr, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select, useToast, Th } from '@chakra-ui/react';
import Navbar from '../Components/Navbar';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:5000'); // Replace with your server's URL

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // const [update, setUpdate] = useState(false);
  const isAdmin = JSON.parse(localStorage.getItem('role')) === 'admin';
  const customer_role = JSON.parse(localStorage.getItem('role'));
  const customer_email = JSON.parse(localStorage.getItem('email'));
  const toast = useToast();

  useEffect(() => {
    socket.on('order_status_update', handleOrderStatusUpdate);
    socket.on('new_order', handleNewOrder);

    return () => {
      socket.off('order_status_update', handleOrderStatusUpdate);
      socket.off('new_order', handleNewOrder);
    };
  }, []);

  useEffect(() => {
    fetchOrders();

    return () => {
      // socket.disconnect();
      socket.off('order_status_update', handleOrderStatusUpdate);
      socket.off('new_order', handleNewOrder);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/orders/${customer_role}/${customer_email}`);
      const data = await response.json();
      setOrders(data.data.orders);
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
  };

  const handleOrderStatusUpdate = () => {
    fetchOrders();
  };

  const handleNewOrder = () => {
    fetchOrders();
  };

  const updateOrderStatus = (orderId, status) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, status: status, customer_email }),
    };

    fetch('http://127.0.0.1:5000/order/update_status', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        toast({
          title: 'Status Updated !!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // setUpdate(!update);
        setShowModal(false);
        fetchOrders();
      })
      .catch((error) => console.log(error));
  };

  const handleModalOpen = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div style={{ margin: '20px' }}>
        <Table variant="striped" colorScheme="blue">
          <Thead fontWeight="bold">
            <Tr>
              <Th>ORDER ID</Th>
              <Th>CUSTOMER NAME</Th>
              <Th>DISHES</Th>
              <Th>TOTAL PRICE</Th>
              <Th>STATUS</Th>
              {isAdmin ? <Th></Th> : null}
            </Tr>
          </Thead>
          <Tbody fontWeight="bold">
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.customer_name}</Td>
                <Td>{order.dishes.join(', ')}</Td>
                <Td>$ {order.total_price}</Td>
                <Td>{order.status}</Td>
                {isAdmin && order.status !== 'delivered' ? (
                  <Td>
                    <Button colorScheme="blue" onClick={() => handleModalOpen(order)}>
                      Update Status
                    </Button>
                  </Td>
                ) : null}
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Modal for updating order status */}
        <Modal isOpen={showModal} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Order Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Select defaultValue={selectedOrder ? selectedOrder.status : ''} onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}>
                <option value="received">Received</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default Orders;

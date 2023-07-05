import React, { useState, useEffect } from 'react';
import { Button, Table, Tbody, Tr, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select } from '@chakra-ui/react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [update,setUpdate] = useState(false);
  const isAdmin = JSON.parse(localStorage.getItem('role')) === 'admin';

  // Fetch orders data from backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/orders')
      .then(response => response.json())
      .then(data => setOrders(data.orders))
      .catch(error => console.log(error));
  }, [update]);

  // Function to update order status
  const updateOrderStatus = (orderId, status) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, status: status })
    };

    fetch('http://127.0.0.1:5000/order/update_status', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Refresh orders data after status update
        setUpdate(!update)
        setShowModal(false)
        fetch('/orders')
          .then(response => response.json())
          .then(data => setOrders(data.orders))
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  // Function to handle modal open and close
  const handleModalOpen = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <div>
      <Table variant="striped">
        <Tbody>
          {orders.map(order => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.customer_name}</Td>
              <Td>{order.dishes.join(', ')}</Td>
              <Td>{order.total_price}</Td>
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
  );
};

export default Orders;
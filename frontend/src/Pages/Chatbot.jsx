import { useRef, useState } from "react";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";

// const init = {
//   role: "system",
//   content: "Hi 👋, I am AI Assistant of Flavor Fusion.",
// };

export const Chatbot = () => {
    const inputRef = useRef(null);
    const [input, setInput] = useState("");
    // const [bot, setBot] = useState([init]);
    const [chatHistory,setchatHistory] = useState([{role:"system",content:"Hi 👋, I am AI Assistant of Flavor Fusion."}])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = [{role:'system', content: `Take a role of AI Assistant of hotel Flavor Fusion and respond to only queries which are related to hotel Flavor Fusion or the queries which are general hotel queries like what are your active hours of food delivery?.You are not at all supposed to respond to any queries which are not related to our hotel or general hotel related queries. If you encounter such query then respnd saying I am an AI Assistant of Hotel Flavor Fusion so I can't answer questions like these. Here's the query: \n${input}`},{ role: "user", content: input }];
    const newdata = message;

    // setBot(newdata);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: newdata,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          },
        }
      );
      console.log(response);
      const chatbotMessage = response.data.choices[0].message.content;
      console.log(chatbotMessage);
      const updatedChatHistory = [
        ...chatHistory,
        { role: "user", content: input },
        { role: "assistant", content: chatbotMessage },
      ];
      console.log(updatedChatHistory);

      setchatHistory(updatedChatHistory);
      setInput("");
      inputRef.current.focus();
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <>
    {/* <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="gray.100"
    > */}

      <Box
        m={'auto'}
        width="400px"
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        bg="white"
        boxShadow="md"
      >
        <Box p="4">
          {chatHistory.map((message, index) => (
            <Flex key={index} direction={message.role === "system" ? "column" : "row"} mb="2">
              <Box
                px="3"
                py="2"
                borderRadius="md"
                bg={message.role === "user" ? "gray.200" : "blue"}
                color={message.role === "user" ? "gray.600" : "white"}
              >
                <Text fontSize="sm">{message.content}</Text>
              </Box>
            </Flex>
          ))}
        </Box>
        <Box borderTopWidth="1px" p="4">
          <form onSubmit={handleSubmit}>
            <Flex>
              <Textarea
                ref={inputRef}
                flex="1"
                resize="none"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" ml="2" colorScheme="blue">
                Send
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
   {/* </Flex> */}
   </>
);
};
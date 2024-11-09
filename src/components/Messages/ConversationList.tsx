import axios from "axios";
import { useEffect, useState } from "react";
import ConversationListItem from "./ConversationListItem";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { Box, Divider, IconButton, List, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  setConversations,
  setSelectedConversation,
} from "../../state/slices/messagesSlice";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CreateMessageModal from "./CreateMessageModal/CreateMessageModal";
import SearchBar from "../Common/SearchBar";

const styles = {
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 1,
    paddingLeft: 2,
    paddingRight: 1,
  },
  searchBarContainer: { padding: 1 },
};

const ConversationList = () => {
  const { conversations, selectedConversation } = useAppSelector(
    (state) => state.messages
  );
  const [messageModal, showMessageModal] = useState(false);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get("http://localhost:3001/api/messages", {
          params: {
            userId: user.userId,
          },
        });
        dispatch(setConversations(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [dispatch, user]);

  return (
    <Box>
      <Box sx={styles.header}>
        <Typography variant="h2">Messages</Typography>
        <IconButton onClick={() => showMessageModal(true)}>
          <ChatOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={styles.searchBarContainer}>
        <SearchBar placeholder="Search Messages" />
      </Box>
      <Divider />
      <List component="div">
        {conversations.map((o) => (
          <ConversationListItem
            key={o.otherUserId}
            conversation={o}
            onClick={() => {
              navigate(`/messages/${user.userId}/${o.otherUserId}`);
            }}
            selected={selectedConversation.userId === o.otherUserId}
          />
        ))}
      </List>
      <CreateMessageModal
        onClose={() => showMessageModal(false)}
        open={messageModal}
      />
    </Box>
  );
};

export default ConversationList;

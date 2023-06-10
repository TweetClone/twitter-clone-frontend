import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import IconButton from "@mui/material/IconButton";
import ConversationList from "../components/Messages/ConversationList";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../state/hooks";
import SearchBar from "../components/Common/SearchBar";
import InfoIcon from "@mui/icons-material/Info";

const styles = {
  messagesHeader: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 2,
    paddingRight: 2,
    paddingLeft: 2,
    paddingBottom: 0,
  },
  conversationListContainer: {
    maxWidth: "30%",
  },
  root: {
    width: "100%",
  },
  directMessageActivityContainer: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    width: "50%",
  },
  directMessageActivityHeader: {
    display: "flex",
    flexBasis: "auto",
    width: "100%",
    justifyContent: "space-between",
    paddingRight: 2,
    paddingLeft: 2,
    boxSizing: "border-box",
  },
};

export type Message = {
  messageId: number;
  timestamp: string;
  textContent: string;
  sentUserId: number;
  receivedUserId: number;
};

const DirectMessage = () => {
  const { userId1, userId2 } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useAppSelector((state) => state.user);
  const selectedConversation = useAppSelector((state) => state.messages);

  useEffect(() => {
    const fetchDirectMessage = async () => {
      const result = await axios.get(
        `http://localhost:3001/api/messages/${userId1}/${userId2}`
      );
      setMessages(result.data as Message[]);
    };
    fetchDirectMessage();
  }, [userId1, userId2]);

  return (
    <Stack direction="row" sx={styles.root}>
      <Box sx={styles.conversationListContainer}>
        <Box sx={styles.messagesHeader}>
          <Typography variant="h6">Messages</Typography>
          <IconButton>
            <ChatIcon />
          </IconButton>
        </Box>
        <SearchBar placeholder="Search Messages" />
        <Divider />
        <ConversationList />
      </Box>
      <Divider flexItem orientation="vertical" />
      <Box sx={styles.directMessageActivityContainer}>
        <Box sx={styles.directMessageActivityHeader}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ padding: 1 }}>
              <Avatar />
            </Box>
            <Box sx={{ padding: 1 }}>
              <Typography variant="subtitle1">
                {selectedConversation.displayName}
              </Typography>
              <Typography variant="subtitle2">{`@${selectedConversation.username}`}</Typography>
            </Box>
          </Box>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Box>
        <Divider flexItem />
        <List component="div" sx={{ width: "100%" }}>
          {messages.map((o) => (
            <ListItem component="div">
              <ListItemText
                sx={
                  o.sentUserId === user.userId
                    ? {
                        display: "flex",
                        justifyContent: "flex-end",
                      }
                    : undefined
                }
              >
                <Typography variant="body2">{o.textContent}</Typography>
                <Typography variant="caption">{o.timestamp}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider flexItem orientation="vertical" />
    </Stack>
  );
};

export default DirectMessage;

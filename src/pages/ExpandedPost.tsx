import { Box, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import ExpandedPostItem from "../components/Posts/ExpandedPostItem";
import ComposeReply from "../components/Posts/ComposeReply";
import ExpandedPostReplies from "../components/Posts/ExpandedPostReplies";

const styles = {
  root: {
    width: "100%",
  },
  postListContainer: { padding: 0, width: "50%" },
  divider: { paddingBottom: 3 },
};

const ExpandedPost = () => {
  return (
    <Stack direction="row" sx={styles.root}>
      <Box sx={styles.postListContainer}>
        <ExpandedPostItem />
        <ComposeReply placeholder="Post your reply" />
        <Divider />
        <ExpandedPostReplies />
      </Box>
      <Divider orientation="vertical" />
    </Stack>
  );
};

export default ExpandedPost;

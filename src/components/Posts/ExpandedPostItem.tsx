import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import Avatar from "@mui/material/Avatar/Avatar";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CardHeader from "@mui/material/CardHeader/CardHeader";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton/IconButton";
import CardMedia from "@mui/material/CardMedia/CardMedia";
import CardActions from "@mui/material/CardActions/CardActions";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { useNavigate, useParams } from "react-router-dom";
import {
  setPost,
  updateExpandedPost,
} from "../../state/slices/expandedPostSlice";
import { useEffect } from "react";

const styles = {
  card: {
    padding: 0,
    boxShadow: "none",
  },
  cardActions: {
    width: "100%",
  },
  actionNumbers: {
    border: "none",
    fontSize: 14.5,
    padding: 0,
    backgroundColor: "white",
    color: "black",
    textTransform: "none",
    fontWeight: "bold",
    marginRight: 2,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#FFFFFF",
    },
  },
  actionData: {
    display: "flex",
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
  },
  timestampBox: {
    display: "flex",
    paddingTop: 1,
    paddingBottom: 1,
  },
  actionTitles: {
    paddingLeft: 0.5,
    fontSize: 14.5,
  },
  timestamp: {
    paddingLeft: 2,
    fontSize: 14.5,
    color: "#a4a8ab",
  },
  actionArea: {
    "&:hover $focusHighlight": {
      opacity: 0,
    },
  },
  topHeader: {
    display: "flex",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "transparent",
    paddingRight: 20,
  },
  headerTitle: {
    fontWeight: "bold",
  },
};

const ExpandedPostItem = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const post = useAppSelector((state) => state.post);
  const urlParams = useParams();

  // TODO: fetch post data when a user may redirect directly to this link
  useEffect(() => {
    const updatedExpandedPost = async () => {
      const backupFetch = await axios.get(
        "http://localhost:3001/api/posts/fetchPost",
        {
          params: {
            userId: user.userId,
            postId: urlParams.postId,
          },
        }
      );
      dispatch(setPost(backupFetch.data));
    };
    updatedExpandedPost();
  }, [dispatch, user.userId, urlParams.postId]);

  const likePost = async (postId: number, userId?: number) => {
    await axios.post("http://localhost:3001/api/posts/likePost", {
      postId,
      userId,
    });
    const updatedPost = {
      ...post,
      isLikedByCurrentUser: !post.isLikedByCurrentUser,
      numberOfLikes: post.isLikedByCurrentUser
        ? post.numberOfLikes - 1
        : post.numberOfLikes + 1,
    };
    dispatch(updateExpandedPost(updatedPost));
  };

  const unlikePost = async (postId: number, userId?: number) => {
    await axios.delete("http://localhost:3001/api/posts/unlikePost", {
      params: {
        postId,
        userId,
      },
    });
    const updatedPost = {
      ...post,
      isLikedByCurrentUser: !post.isLikedByCurrentUser,
      numberOfLikes: post.isLikedByCurrentUser
        ? post.numberOfLikes - 1
        : post.numberOfLikes + 1,
    };
    dispatch(updateExpandedPost(updatedPost));
  };

  const navigate = useNavigate();
  const routeChange = () => {
    const path = `/post/${post.postId}`;
    navigate(path, { state: post.postId });
  };

  return (
    <Card sx={styles.card}>
      <Box style={styles.topHeader}>
        <IconButton style={styles.backButton} onClick={() => navigate(-1)}>
          <KeyboardBackspaceIcon color="secondary" />
        </IconButton>
        <Typography style={styles.headerTitle}>Post</Typography>
      </Box>
      <CardHeader
        avatar={<Avatar>CK</Avatar>}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={`${post.displayName} `}
        subheader={`@${post.username}`}
      />
      <CardActionArea onClick={() => routeChange()}>
        <CardContent sx={{ width: 400 }}>
          <Typography>{post.textContent}</Typography>
        </CardContent>
        {post.imagePath && (
          <CardMedia
            sx={{ maxWidth: 200, margin: "auto" }}
            component="img"
            image={post.imagePath}
          />
        )}
      </CardActionArea>

      <Box sx={styles.timestampBox}>
        <Typography component={"span"} sx={styles.timestamp}>
          {post.timestamp}
        </Typography>
      </Box>
      <Divider variant="middle" />
      <Box sx={styles.actionData}>
        <Button component={"span"} sx={styles.actionNumbers}>
          {post.numberOfLikes}
          <Typography sx={styles.actionTitles}>Likes</Typography>
        </Button>
        <Button component={"span"} sx={styles.actionNumbers}>
          1<Typography sx={styles.actionTitles}>Comments</Typography>
        </Button>
        <Button component={"span"} sx={styles.actionNumbers}>
          1<Typography sx={styles.actionTitles}>Retweets</Typography>
        </Button>
      </Box>
      <Divider variant="middle" />
      <CardActions>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={styles.cardActions}
        >
          <Button
            onClick={() => {
              post.isLikedByCurrentUser
                ? unlikePost(post.postId, user.userId)
                : likePost(post.postId, user.userId);
            }}
          >
            {post.isLikedByCurrentUser ? (
              <FavoriteOutlinedIcon />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
          </Button>
          <Button>
            <AddCommentOutlinedIcon />
          </Button>
          <Button>
            <RepeatOutlinedIcon />
          </Button>
          <Button>
            <ShareOutlinedIcon />
          </Button>
        </Stack>
      </CardActions>
      <Divider variant="middle" />
    </Card>
  );
};

export default ExpandedPostItem;

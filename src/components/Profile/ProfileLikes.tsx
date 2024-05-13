import { useEffect } from "react";
import PostItem from "../Posts/PostItem";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { Post, setPosts } from "../../state/slices/postsSlice";
import { Box, Divider, Stack } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import PageLoader from "../../pages/PageLoader";
import { queryClient } from "../../utilities/queryClient";
import InfiniteScroll from "react-infinite-scroll-component";

type ProfileLikesProps = {
  userId: number;
};

const ProfileLikes = ({ userId }: ProfileLikesProps) => {
  const { posts } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  const fetchPosts = async ({ pageParam = 1 }) => {
    try {
      const result = await axios.get(
        "http://localhost:3001/api/profile/getUserLikes",
        {
          params: {
            visitedUserId: userId,
            offset: pageParam,
          },
        }
      );

      if (pageParam > 1) {
        dispatch(setPosts([...posts, ...result.data] as Post[]));
      } else {
        dispatch(setPosts(result.data as Post[]));
      }

      return result.data;
    } catch (error) {
      console.error("error fetching posts:", error);
    }
  };

  const { error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["likes"],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    queryClient.clear();
    fetchPosts({ pageParam: 1 });
  }, [userId]);

  if (status === "pending") return <PageLoader />;
  if (status === "error") return <div>{error.message}</div>;

  return (
    <Stack divider={<Divider />}>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<PageLoader />}
        scrollableTarget={"scrollable"}
      >
        {posts.map((o, index) => (
          <Box key={index}>
            <PostItem post={o} />
            <Divider />
          </Box>
        ))}
      </InfiniteScroll>
    </Stack>
  );
};

export default ProfileLikes;

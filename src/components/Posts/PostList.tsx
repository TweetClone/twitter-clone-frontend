import { useEffect } from "react";
import PostItem from "./PostItem";
import { useAppSelector } from "../../state/hooks";
import { Box, Divider, Stack } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryClient } from "../../utilities/queryClient";
import PageLoader from "../../pages/PageLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import useFetchPosts from "../../utilities/useFetchPosts";

const PostList = () => {
  const posts = useAppSelector((state) => state.posts.posts);
  const user = useAppSelector((state) => state.user);
  const { fetchPosts } = useFetchPosts("http://localhost:3001/api/posts");

  const { error, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["timeline"],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    queryClient.clear();
    fetchPosts(1);
  }, [user.userId]);

  if (status === "pending") return <PageLoader />;
  if (status === "error") return <div>{error.message}</div>; // TODO: Create an Error Component

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

export default PostList;

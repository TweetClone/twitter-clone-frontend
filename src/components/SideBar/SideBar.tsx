import { Box } from "@mui/material";
import SuggestedUserItem from "./SuggestedUsers";
import SidebarFooter from "./SidebarFooter";
import Advertisement from "./Advertisement";
import SearchBar from "../Common/SearchBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const styles = {
  rightContent: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    height: "100vh",
    position: "fixed",
    width: "310px",
  },
  searchBarContainer: { paddingTop: 1 },
};

const SideBar = () => {
  const [focusSearchBar, setFocusSearchBar] = useState(false);
  const navigate = useNavigate();
  const onSelect = (selectedUsername: string) => {
    const path = `/${selectedUsername}`;
    navigate(path);
  };

  return (
    <Box sx={styles.rightContent}>
      <Box sx={styles.searchBarContainer}>
        <SearchBar
          placeholder="Search Chirp"
          focusSearchBar={focusSearchBar}
          onSearchOpen={() => setFocusSearchBar(true)}
          onSearchClose={() => setFocusSearchBar(false)}
          onSelect={onSelect}
        />
      </Box>
      <SuggestedUserItem />
      <Advertisement />
      <SidebarFooter />
    </Box>
  );
};

export default SideBar;

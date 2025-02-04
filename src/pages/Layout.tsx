import { Box, Divider, Stack } from "@mui/material";
import { ReactElement } from "react";
import NavBar from "../components/NavBar/NavBar";

const styles = {
  container: { height: "auto", justifyContent: "center" },
  divider: { height: "auto" },
  middleContent: { flex: "0 1 600px", minWidth: 0 },
  rightContent: {
    boxSizing: "border-box",
    flex: "0 0 350px",
    minWidth: 0,
    paddingLeft: "40px",
  },
};

type LayoutProps = {
  middleContent: ReactElement;
  rightContent?: ReactElement;
};

const Layout = ({ middleContent, rightContent }: LayoutProps) => {
  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" sx={styles.divider} />}
      sx={styles.container}
    >
      <NavBar />
      <Box sx={styles.middleContent}>{middleContent}</Box>
      <Box sx={styles.rightContent}>{rightContent}</Box>
    </Stack>
  );
};

export default Layout;

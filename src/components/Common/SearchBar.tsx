import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Autocomplete,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { SelectedUser } from "../../state/slices/messagesSlice";
import { useNavigate } from "react-router-dom";

type SearchBarProps = {
  placeholder: string;
};

const styles = {
  autocomplete: {
    "&.MuiAutocomplete-input": { paddingX: 0 },
    position: "relative",
  },
  box: {
    paddingBottom: 1,
    paddingTop: 0,
    paddingX: 2,
  },
  displayName: {
    fontWeight: "bold",
  },
  listBox: {
    maxHeight: "60vh",
    overflowY: "auto",
    zIndex: 1300,
  },
  searchIcon: {
    paddingRight: 0,
    "&.Mui-disabled": {
      color: "gray.main",
    },
  },
  searchIconFocused: {
    paddingRight: 0,
    "&.Mui-disabled": {
      color: "primary.main",
    },
  },
};

const SearchBar = ({ placeholder }: SearchBarProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState("");
  const [userList, setUserList] = useState<SelectedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusSearchBar, setFocusSearchBar] = useState(false);

  const onSelect = (selectedUsername: string) => {
    setFocusSearchBar(false);
    setKeywords("");
    const path = `/${selectedUsername}`;
    navigate(path);
  };

  const handleClear = () => {
    setKeywords("");
    setUserList([]);
  };

  useEffect(() => {
    fetchUsers();
  }, [keywords]);

  const fetchUsers = async () => {
    setLoading(true);
    if (keywords.length === 0) return {};
    try {
      const token = await getAccessTokenSilently();
      const result = await axios.get(
        `http://localhost:3001/api/users/getUsers`,
        {
          params: {
            keyword: keywords,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserList(result.data as SelectedUser[]);

      return result.data;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.box}>
      <Autocomplete
        disablePortal
        forcePopupIcon={false}
        fullWidth
        filterOptions={(x) => x}
        getOptionLabel={(option) => `${option.displayName} @${option.username}`}
        id="search"
        inputValue={keywords}
        ListboxProps={{ sx: styles.listBox }}
        loading={loading}
        onBlur={() => setFocusSearchBar(false)}
        onInputChange={(_, newInputValue) => {
          setKeywords(newInputValue);
          setFocusSearchBar(true);
          if (newInputValue === "") {
            setUserList([]); // Clear user list when input is cleared
          }
        }}
        onFocus={() => setFocusSearchBar(true)}
        open={focusSearchBar}
        openOnFocus
        options={userList}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            hiddenLabel
            InputProps={{
              ...params.InputProps,
              endAdornment: keywords && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleClear()}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    disabled
                    sx={
                      focusSearchBar
                        ? styles.searchIconFocused
                        : styles.searchIcon
                    }
                  >
                    <SearchRoundedIcon />
                  </IconButton>
                </InputAdornment>
              ),
              type: "text",
            }}
            placeholder={placeholder}
            size="small"
          />
        )}
        renderOption={(params, option) => (
          <Box key={option.userId}>
            <ListItemButton
              {...params}
              component="li"
              key={option.userId}
              onClick={() => onSelect(option.username)}
            >
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Box>
                    <Typography sx={styles.displayName} variant="body1">
                      {option.displayName}
                    </Typography>
                    <Typography variant="body2">{`@${option.username}`}</Typography>
                  </Box>
                }
              />
            </ListItemButton>
          </Box>
        )}
        sx={styles.autocomplete}
      />
    </Box>
  );
};

export default SearchBar;

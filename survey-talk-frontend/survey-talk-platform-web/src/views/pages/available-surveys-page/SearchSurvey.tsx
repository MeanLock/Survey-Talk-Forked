"use client";

import type React from "react";
import { useState } from "react";
import {
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Box,
} from "@mui/material";
import { Search as SearchIcon, Tune as TuneIcon } from "@mui/icons-material";

// Mock data for demonstration
import { SurveyTopics } from "../../../core/mockData/mockData";

interface SearchComponentProps {
  keyword: string;
  setKeyword: (value: string) => void;
  additional: string;
  handleAddtionalChange: (value: string) => void;
  selectedTopics: number[];
  handleTopicFilterChange: (topicId: number) => void;
  handleSearchAPI: () => void;
}

export const SearchSurvey: React.FC<SearchComponentProps> = ({
  keyword,
  setKeyword,
  additional,
  handleAddtionalChange,
  selectedTopics,
  handleTopicFilterChange,
  handleSearchAPI,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleSearch = () => {
    handleSearchAPI();
    setIsFilterModalOpen(false);
  };

  return (
    <>
      {/* Search Bar */}
      <Box className="w-full h-[50px] flex items-center gap-2 bg-white rounded-lg border border-gray-300">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter survey name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "none",
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
          }}
        />

        <IconButton
          onClick={handleOpenFilterModal}
          sx={{
            color: "#3E5DAB",
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
          }}
        >
          <TuneIcon />
        </IconButton>

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearchAPI}
          sx={{
            backgroundColor: "#3e5dab",
            "&:hover": {
              backgroundColor: "#4338ca",
            },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.5,
          }}
        >
          Search
        </Button>
      </Box>

      {/* Filter Modal */}
      <Dialog
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
          Filter Options
        </DialogTitle>

        <DialogContent>
          <Box className="flex flex-col gap-6">
            {/* Additional Options */}
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ fontWeight: "bold", color: "#374151", mb: 2 }}
              >
                Additional Options
              </FormLabel>
              <RadioGroup
                value={additional}
                onChange={(e) => handleAddtionalChange(e.target.value)}
              >
                <FormControlLabel
                  value="Suit You Best"
                  control={<Radio />}
                  label="Suit You Best"
                />
                <FormControlLabel
                  value="Big Bonus"
                  control={<Radio />}
                  label="Big Bonus"
                />
              </RadioGroup>
            </FormControl>

            {/* Topics */}
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ fontWeight: "bold", color: "#3e5dab", mb: 2 }}
              >
                Topics
              </FormLabel>
              <FormGroup>
                {SurveyTopics.map((topic) => (
                  <FormControlLabel
                    key={topic.id}
                    control={
                      <Checkbox
                        checked={selectedTopics.includes(topic.id)}
                        onChange={() => handleTopicFilterChange(topic.id)}
                      />
                    }
                    label={topic.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>

        {/* <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCloseFilterModal}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSearch}
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": {
                backgroundColor: "#4338ca",
              },
              textTransform: "none",
            }}
          >
            Search
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

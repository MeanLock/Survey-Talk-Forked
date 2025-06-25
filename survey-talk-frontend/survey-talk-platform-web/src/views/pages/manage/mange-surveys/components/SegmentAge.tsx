import React, { useState } from "react";
import { Button, TextField, Typography, Chip } from "@mui/material";

interface Props {
  value: string;
  onChangeValue: (value: string) => void;
}

export const SegmentAge: React.FC<Props> = ({ value, onChangeValue }) => {
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  const handleAddAgeRange = () => {
    if (minAge && maxAge) {
      const newRange = `Từ ${minAge} đến ${maxAge} tuổi`;
      const updatedValue = value
        ? `${value} | ${newRange}` // Append with ". " if value is not empty
        : newRange; // Avoid adding leading ". " for empty initial state
      onChangeValue(updatedValue);
      setMinAge("");
      setMaxAge("");
    }
  };

  const handleDeleteChip = (range: string) => {
    const updatedValue = value
      .split(" | ")
      .filter((item) => item !== range)
      .join(" | ");
    onChangeValue(updatedValue);
  };

  const parseRangesToChips = () => {
    return value
      .split(" | ")
      .map((range) => {
        const match = range.match(/Từ (\d+) đến (\d+) tuổi/);
        return match ? `${match[1]}-${match[2]}` : null;
      })
      .filter(Boolean);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Typography variant="h6">Nhập khoảng độ tuổi</Typography>
      <div className="flex gap-2">
        <TextField
          label="Từ"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          type="number"
          variant="outlined"
        />
        <TextField
          label="Đến"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          type="number"
          variant="outlined"
        />
        <Button variant="contained" onClick={handleAddAgeRange}>
          Thêm
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {parseRangesToChips().map((chip, index) => (
          <Chip
            key={index}
            label={chip}
            onDelete={() =>
              handleDeleteChip(
                `Từ ${chip.split("-")[0]} đến ${chip.split("-")[1]} tuổi`
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

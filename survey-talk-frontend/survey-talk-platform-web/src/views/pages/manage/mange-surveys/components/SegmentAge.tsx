"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Calendar } from "lucide-react";

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
      const updatedValue = value ? `${value} | ${newRange}` : newRange;
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
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-[#3E5DAB]">
          <Calendar className="w-5 h-5" />
          Nhập khoảng độ tuổi
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="minAge" className="text-sm font-medium">
              Từ (tuổi)
            </Label>
            <Input
              id="minAge"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              type="number"
              placeholder="18"
              className="focus:ring-[#3E5DAB] focus:border-[#3E5DAB]"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="maxAge" className="text-sm font-medium">
              Đến (tuổi)
            </Label>
            <Input
              id="maxAge"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              type="number"
              placeholder="65"
              className="focus:ring-[#3E5DAB] focus:border-[#3E5DAB]"
            />
          </div>
          <Button
            onClick={handleAddAgeRange}
            disabled={!minAge || !maxAge}
            className="!bg-[#FFC40D] !hover:bg-[#FFC40D]/90 !text-black font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>

        {parseRangesToChips().length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Khoảng tuổi đã chọn:
            </Label>
            <div className="flex flex-wrap gap-2">
              {parseRangesToChips().map((chip, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#3E5DAB]/10 text-[#3E5DAB] border border-[#3E5DAB]/20 px-3 py-1 text-sm font-medium hover:bg-[#3E5DAB]/20 transition-colors"
                >
                  {chip} tuổi
                  <button
                    onClick={() =>
                      handleDeleteChip(
                        `Từ ${chip.split("-")[0]} đến ${
                          chip.split("-")[1]
                        } tuổi`
                      )
                    }
                    className="ml-2 !hover:text-red-600 !bg-transparent !hover:bg-gray-300"
                  >
                    <X className="w-3 h-3 !bg-transparent !hover:bg-gray-400" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {parseRangesToChips().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chưa có khoảng tuổi nào được chọn</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

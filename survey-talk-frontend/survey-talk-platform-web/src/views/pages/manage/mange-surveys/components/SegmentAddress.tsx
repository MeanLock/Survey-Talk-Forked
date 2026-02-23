import React from "react";

interface Props {
  value: string;
  onChangeValue: (value: string) => void;
}

export const SegmentAddress: React.FC<Props> = ({ value, onChangeValue }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <p>Address filter functionality will be implemented later.</p>
    </div>
  );
};

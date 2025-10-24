"use client";

import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => {
  const [isAdding, setIsAdding] = useState(false);
  const handleAddNode = () => {
    setIsAdding(true);
    // Simulate an async operation
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  return (
    <Button
      onClick={handleAddNode}
      disabled={isAdding}
      size="icon"
      variant="outline"
      className="bg-background"
    >
      <PlusIcon />
    </Button>
  );
});
AddNodeButton.displayName = "AddNodeButton";

import React from "react";
import { Skeleton } from "moti/skeleton";
import { Card } from "@/components/ui/card";

interface SkeletonCardProps {
  height?: number;
  rows?: number;
}

export const SkeletonCard = ({ height, rows }: SkeletonCardProps) => {
  return (
    <Card className="p-4 m-2 shadow-sm border border-gray-200 gap-2">
      {rows ? (
        Array.from({ length: rows }).map((_, i: number) => (
          <Skeleton key={i} height={height} width={"100%"} colorMode="light" />
        ))
      ) : (
        <Skeleton height={height} width={"100%"} colorMode="light" />
      )}
    </Card>
  );
};

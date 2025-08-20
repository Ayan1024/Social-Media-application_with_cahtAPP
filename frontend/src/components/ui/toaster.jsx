'use client'
import { useToast } from "@chakra-ui/react";

export const useAppToast = () => {
  const toast = useToast();

  const showToast = ({ title, description, status }) => {
    toast({
      title,
      description,
      status, // "success" | "error" | "warning" | "info"
      duration: 3000,
      isClosable: true,
      position: "bottom-end",
    });
  };

  return { showToast };
};

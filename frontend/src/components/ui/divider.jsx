// components/Divider.jsx
import { Box } from "@chakra-ui/react";
import React from "react";

const Divider = ({ my,  thickness, color = "gray.700" }) => {
  return (
    <Box
      my={my}
      borderBottom={`${thickness} solid`}
      borderColor={color}
      w="full"
    />
  );
};

export default Divider;

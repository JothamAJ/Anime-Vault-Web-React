import React, { ReactNode } from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Container from "@mui/material/Container";
//import outlet to render child routes
import { Outlet } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
};

export default Layout;

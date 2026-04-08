import React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ExecutorProvider } from "@executor/react/api/provider";
import { Shell } from "../web/shell";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ExecutorProvider>
      <Shell />
    </ExecutorProvider>
  );
}

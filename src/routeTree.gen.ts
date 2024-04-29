/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const LoginLazyImport = createFileRoute('/login')()
const LayoutLazyImport = createFileRoute('/layout')()
const IndexLazyImport = createFileRoute('/')()
const LayoutProfilesLazyImport = createFileRoute('/layout/profiles')()
const LayoutNewprofilesLazyImport = createFileRoute('/layout/newprofiles')()

// Create/Update Routes

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const LayoutLazyRoute = LayoutLazyImport.update({
  path: '/layout',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/layout.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const LayoutProfilesLazyRoute = LayoutProfilesLazyImport.update({
  path: '/profiles',
  getParentRoute: () => LayoutLazyRoute,
} as any).lazy(() =>
  import('./routes/layout.profiles.lazy').then((d) => d.Route),
)

const LayoutNewprofilesLazyRoute = LayoutNewprofilesLazyImport.update({
  path: '/newprofiles',
  getParentRoute: () => LayoutLazyRoute,
} as any).lazy(() =>
  import('./routes/layout.newprofiles.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/layout': {
      preLoaderRoute: typeof LayoutLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/layout/newprofiles': {
      preLoaderRoute: typeof LayoutNewprofilesLazyImport
      parentRoute: typeof LayoutLazyImport
    }
    '/layout/profiles': {
      preLoaderRoute: typeof LayoutProfilesLazyImport
      parentRoute: typeof LayoutLazyImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  LayoutLazyRoute.addChildren([
    LayoutNewprofilesLazyRoute,
    LayoutProfilesLazyRoute,
  ]),
  LoginLazyRoute,
])

/* prettier-ignore-end */

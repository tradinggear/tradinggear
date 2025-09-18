import{j as v}from"./jsx-runtime-Ds-gkUgj.js";import{r}from"./index-CtvPRVHf.js";import{a as C}from"./index-WEdp_TFg.js";import{E as h,o as y,p as E,q as M}from"./index-kH-wUL5G.js";import{R as g}from"./index-D4s4T6i4.js";import{i as b,d as F,c as S,s as k,g as P,a as B,b as D,e as H,R as O,f as j}from"./components-DueK1IyD.js";/**
 * React Router v6.30.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */new Promise(()=>{});function z(e){let s={hasErrorBoundary:e.ErrorBoundary!=null||e.errorElement!=null};return e.Component&&Object.assign(s,{element:r.createElement(e.Component),Component:void 0}),e.HydrateFallback&&Object.assign(s,{hydrateFallbackElement:r.createElement(e.HydrateFallback),HydrateFallback:void 0}),e.ErrorBoundary&&Object.assign(s,{errorElement:r.createElement(e.ErrorBoundary),ErrorBoundary:void 0}),s}/**
 * @remix-run/react v2.16.8
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function L(e){if(!e)return null;let s=Object.entries(e),u={};for(let[n,t]of s)if(t&&t.__type==="RouteErrorResponse")u[n]=new h(t.status,t.statusText,t.data,t.internal===!0);else if(t&&t.__type==="Error"){if(t.__subType){let a=window[t.__subType];if(typeof a=="function")try{let i=new a(t.message);i.stack=t.stack,u[n]=i}catch{}}if(u[n]==null){let a=new Error(t.message);a.stack=t.stack,u[n]=a}}else u[n]=t;return u}/**
 * @remix-run/react v2.16.8
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let l,o,f=!1,p;new Promise(e=>{p=e}).catch(()=>{});function T(e){if(!o){if(window.__remixContext.future.v3_singleFetch){if(!l){let d=window.__remixContext.stream;b(d,"No stream found for single fetch decoding"),window.__remixContext.stream=void 0,l=F(d,window).then(m=>{window.__remixContext.state=m.value,l.value=!0}).catch(m=>{l.error=m})}if(l.error)throw l.error;if(!l.value)throw l}let a=S(window.__remixManifest.routes,window.__remixRouteModules,window.__remixContext.state,window.__remixContext.future,window.__remixContext.isSpaMode),i;if(!window.__remixContext.isSpaMode){i={...window.__remixContext.state,loaderData:{...window.__remixContext.state.loaderData}};let d=y(a,window.location,window.__remixContext.basename);if(d)for(let m of d){let _=m.route.id,x=window.__remixRouteModules[_],w=window.__remixManifest.routes[_];x&&k(w,x,window.__remixContext.isSpaMode)&&(x.HydrateFallback||!w.hasLoader)?i.loaderData[_]=void 0:w&&!w.hasLoader&&(i.loaderData[_]=null)}i&&i.errors&&(i.errors=L(i.errors))}o=E({routes:a,history:M(),basename:window.__remixContext.basename,future:{v7_normalizeFormMethod:!0,v7_fetcherPersist:window.__remixContext.future.v3_fetcherPersist,v7_partialHydration:!0,v7_prependBasename:!0,v7_relativeSplatPath:window.__remixContext.future.v3_relativeSplatPath,v7_skipActionErrorRevalidation:window.__remixContext.future.v3_singleFetch===!0},hydrationData:i,mapRouteProperties:z,dataStrategy:window.__remixContext.future.v3_singleFetch&&!window.__remixContext.isSpaMode?B(window.__remixManifest,window.__remixRouteModules,()=>o):void 0,patchRoutesOnNavigation:P(window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode,window.__remixContext.basename)}),o.state.initialized&&(f=!0,o.initialize()),o.createRoutesForHMR=D,window.__remixRouter=o,p&&p(o)}let[s,u]=r.useState(void 0),[n,t]=r.useState(o.state.location);return r.useLayoutEffect(()=>{f||(f=!0,o.initialize())},[]),r.useLayoutEffect(()=>o.subscribe(a=>{a.location!==n&&t(a.location)}),[n]),H(o,window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode),r.createElement(r.Fragment,null,r.createElement(O.Provider,{value:{manifest:window.__remixManifest,routeModules:window.__remixRouteModules,future:window.__remixContext.future,criticalCss:s,isSpaMode:window.__remixContext.isSpaMode}},r.createElement(j,{location:n},r.createElement(g,{router:o,fallbackElement:null,future:{v7_startTransition:!0}}))),window.__remixContext.future.v3_singleFetch?r.createElement(r.Fragment,null):null)}var c={},R;function q(){if(R)return c;R=1;var e=C();return c.createRoot=e.createRoot,c.hydrateRoot=e.hydrateRoot,c}var I=q();r.startTransition(()=>{I.hydrateRoot(document,v.jsx(r.StrictMode,{children:v.jsx(T,{})}))});

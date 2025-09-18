import{j as t}from"./jsx-runtime-Ds-gkUgj.js";import{c as f,d,O as y}from"./index-kH-wUL5G.js";import{u as x,_ as g,M as S,L as w,S as j}from"./components-DueK1IyD.js";import{r as i}from"./index-CtvPRVHf.js";import{u as k}from"./index-D4s4T6i4.js";import"./index-WEdp_TFg.js";/**
 * @remix-run/react v2.16.8
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:e,...l}){let{isSpaMode:c}=x(),r=f(),p=d();k({getKey:e,storageKey:a});let m=i.useMemo(()=>{if(!e)return null;let s=e(r,p);return s!==r.key?s:null},[]);if(c)return null;let u=((s,h)=>{if(!window.history.state||!window.history.state.key){let o=Math.random().toString(32).slice(2);window.history.replaceState({key:o},"")}try{let n=JSON.parse(sessionStorage.getItem(s)||"{}")[h||window.history.state.key];typeof n=="number"&&window.scrollTo(0,n)}catch(o){console.error(o),sessionStorage.removeItem(s)}}).toString();return i.createElement("script",g({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${u})(${JSON.stringify(a)}, ${JSON.stringify(m)})`}}))}const E=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function J({children:e}){return t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx(S,{}),t.jsx(w,{})]}),t.jsxs("body",{children:[e,t.jsx(M,{}),t.jsx(j,{})]})]})}function N(){return t.jsx(y,{})}export{J as Layout,N as default,E as links};

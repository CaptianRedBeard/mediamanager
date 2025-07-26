(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();document.getElementById("gallery");document.querySelector("#app").innerHTML=`
  <h2>Single Image Display</h2>
  <div id="image-container" style="padding:20px;">
    <img id="single-image" style="width:300px; height:auto; border-radius:8px;" />
  </div>
`;const s="295c0f47-ec77-4ac7-8ed1-dda7556fb594",o=document.getElementById("single-image");o.src=`http://localhost:8080/thumb/${s}`;o.alt="Thumbnail image";o.onerror=()=>{o.alt="Failed to load image"};

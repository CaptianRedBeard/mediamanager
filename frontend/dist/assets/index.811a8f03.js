(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();const c="/assets/logo-universal.157a874a.png";document.querySelector("#app").innerHTML=`
    <img id="logo" class="logo">
      <div class="result" id="result">Please enter your name below \u{1F447}</div>
      <div class="input-box" id="input">
        <input class="input" id="name" type="text" autocomplete="off" />
        <button class="btn" onclick="greet()">Greet</button>
      </div>
    </div>
`;document.getElementById("logo").src=c;let i=document.getElementById("name");i.focus();let u=document.getElementById("result");window.greet=function(){let r=i.value;if(r!=="")try{Greet(r).then(o=>{u.innerText=o}).catch(o=>{console.error(o)})}catch(o){console.error(o)}};

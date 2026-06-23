/* Tenstorrent docs — inline Ask AI chat, powered by the Kapa SDK.
 *
 * Bundled (React + react-dom + @kapaai/react-sdk + marked + DOMPurify) into a
 * single self-contained IIFE so there is exactly ONE React instance — this is
 * what fixes the "useContext of null" dual-instance error you hit when loading
 * the SDK off a CDN with an importmap.
 *
 * Exposes window.ttKapaChat.mount(el, integrationId). Once mounted, the chat
 * component wires window.ttKapaSubmit(query) / window.ttKapaReset() so the
 * vanilla tt-search.js can drive it. */
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { KapaProvider, useChat } from "@kapaai/react-sdk";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ breaks: true, gfm: true });

const SVG_COPY =
  '<svg width="14" height="14" viewBox="0 0 20 20" fill="none">' +
  '<rect x="7" y="7" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>' +
  '<path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-7A1.5 1.5 0 0 0 3 5.5v7A1.5 1.5 0 0 0 4.5 14H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
  "</svg>";

const SVG_DONE =
  '<svg width="14" height="14" viewBox="0 0 20 20" fill="none">' +
  '<path d="M4 10l4 4 8-8" stroke="#1e86a9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

function addCopyButtons(container) {
  if (!container) return;
  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".tt-chat-copy-btn")) return; // already added
    const btn = document.createElement("button");
    btn.className = "tt-chat-copy-btn";
    btn.title = "Copy code";
    btn.innerHTML = SVG_COPY;
    btn.addEventListener("click", function () {
      const code = pre.querySelector("code");
      const text = code ? code.textContent : pre.textContent;
      navigator.clipboard && navigator.clipboard.writeText(text);
      btn.innerHTML = SVG_DONE;
      setTimeout(function () { btn.innerHTML = SVG_COPY; }, 1500);
    });
    pre.style.position = "relative";
    pre.appendChild(btn);
  });
}

function renderMarkdown(md) {
  return DOMPurify.sanitize(marked.parse(md || "", { async: false }));
}

function Sources({ sources }) {
  if (!sources || !sources.length) return null;
  const seen = new Map();
  for (const s of sources) {
    const url = s && (s.source_url || s.url);
    if (url && !seen.has(url)) seen.set(url, (s && s.title) || url);
  }
  if (!seen.size) return null;
  const items = [];
  let i = 0;
  for (const [url, title] of seen) {
    if (i++ >= 5) break;
    items.push(
      React.createElement(
        "a",
        { key: url, href: url, target: "_blank", rel: "noopener", className: "tt-chat-source" },
        title
      )
    );
  }
  return React.createElement("div", { className: "tt-chat-sources" }, items);
}

function Turn({ qa }) {
  const streaming = qa.status === "streaming";
  const hasAnswer = qa.answer && qa.answer.length > 0;
  const answerRef = useRef(null);

  // Inject Copy buttons into <pre> blocks after each render.
  useEffect(() => {
    if (answerRef.current) addCopyButtons(answerRef.current);
  });

  let answerNode;
  if (hasAnswer) {
    answerNode = React.createElement("div", {
      ref: answerRef,
      className: "tt-chat-a tt-chat-md",
      dangerouslySetInnerHTML: { __html: renderMarkdown(qa.answer) },
    });
  } else {
    answerNode = React.createElement(
      "div",
      { className: "tt-chat-a tt-chat-a--loading" },
      React.createElement(
        "span",
        { className: "tt-chat-dots" },
        React.createElement("span"),
        React.createElement("span"),
        React.createElement("span")
      )
    );
  }
  return React.createElement(
    "div",
    { className: "tt-chat-turn" },
    React.createElement("div", { className: "tt-chat-q" }, qa.question),
    answerNode,
    !streaming ? React.createElement(Sources, { sources: qa.sources }) : null
  );
}

function Chat() {
  const { conversation, submitQuery, resetConversation, error, isPreparingAnswer } = useChat();
  const endRef = useRef(null);

  useEffect(() => {
    window.ttKapaSubmit = (q) => { if (q) submitQuery(q); };
    window.ttKapaReset = () => { resetConversation(); };
    if (window.__ttKapaPending) {
      const q = window.__ttKapaPending;
      window.__ttKapaPending = null;
      submitQuery(q);
    }
    return () => { window.ttKapaSubmit = null; window.ttKapaReset = null; };
  }, [submitQuery, resetConversation]);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversation]);

  const turns = conversation.map((qa, i) =>
    React.createElement(Turn, { key: qa.id || "t" + i, qa })
  );

  const preparing =
    isPreparingAnswer && conversation.length === 0
      ? React.createElement(
          "div",
          { className: "tt-chat-a tt-chat-a--loading" },
          React.createElement(
            "span",
            { className: "tt-chat-dots" },
            React.createElement("span"),
            React.createElement("span"),
            React.createElement("span")
          )
        )
      : null;

  const errNode = error
    ? React.createElement("div", { className: "tt-chat-error" }, error)
    : null;

  return React.createElement(
    "div",
    { className: "tt-chat-messages" },
    turns,
    preparing,
    errNode,
    React.createElement("div", { ref: endRef })
  );
}

function mount(target, integrationId) {
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (!el) { console.error("[tt-kapa-chat] mount target not found:", target); return; }
  if (el.__ttKapaMounted) return;
  el.__ttKapaMounted = true;
  const root = createRoot(el);
  root.render(
    React.createElement(
      KapaProvider,
      { integrationId, callbacks: {} },
      React.createElement(Chat)
    )
  );
}

window.ttKapaChat = { mount };

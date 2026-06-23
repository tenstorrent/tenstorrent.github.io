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

function renderMarkdown(md) {
  return DOMPurify.sanitize(marked.parse(md || "", { async: false }));
}

function Sources({ sources }) {
  if (!sources || !sources.length) return null;
  // De-dupe by URL, keep first title seen.
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
  let answerNode;
  if (hasAnswer) {
    answerNode = React.createElement("div", {
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
    // Flush any query queued before the bundle finished loading.
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

  // Show a leading loader if a query is in flight but no turn exists yet.
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

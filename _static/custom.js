console.log("custom.js loaded!");

document.addEventListener("DOMContentLoaded", function () {
    function updateExternalLinks() {
        const links = document.querySelectorAll("a[href^='http']");
        links.forEach(function (link) {
            try {
                const url = new URL(link.href, document.baseURI);
                if (url.origin !== window.location.origin) {
                    console.log("Updating external link:", link.href);
                    link.setAttribute("target", "_blank");
                    link.setAttribute("rel", "noopener noreferrer");
                }
            } catch (e) {
                console.warn("Invalid URL skipped:", link.href);
            }
        });
    }

    updateExternalLinks();

    const observer = new MutationObserver(updateExternalLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});

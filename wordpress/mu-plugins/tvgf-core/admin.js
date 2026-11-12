/**
 * TVGF Core field UI: repeater rows (add / remove / reorder) and the Media
 * Library picker for image, video and file fields. Plain JS, no build step.
 */
(function () {
  function rowOf(el) {
    return el.closest(".tvgf-row");
  }

  function addRow(button) {
    var repeater = button.closest(".tvgf-repeater");
    var template = repeater.querySelector(":scope > template");
    var rows = repeater.querySelector(":scope > .tvgf-repeater__rows");
    // Unique, not sequential — PHP reads rows back in document order.
    var index = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    rows.insertAdjacentHTML("beforeend", template.innerHTML.split("__i__").join(index));
    var input = rows.lastElementChild.querySelector("input, textarea, select");
    if (input) input.focus();
  }

  function pickMedia(button) {
    var wrapper = button.closest(".tvgf-field");
    var input = wrapper.querySelector(".tvgf-media__input");
    var library = button.dataset.library;
    var frame = wp.media({
      title: "Choose a file",
      button: { text: "Use this file" },
      library: library ? { type: library } : {},
      multiple: false,
    });
    frame.on("select", function () {
      input.value = frame.state().get("selection").first().toJSON().url;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    frame.open();
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-tvgf-action]");
    if (!button) return;
    // Buttons inside <summary> would otherwise also open/close the row.
    event.preventDefault();

    var row = rowOf(button);
    switch (button.dataset.tvgfAction) {
      case "add":
        addRow(button);
        break;
      case "remove":
        if (window.confirm("Remove this item? It disappears from the site when you save.")) row.remove();
        break;
      case "up":
        if (row.previousElementSibling) row.parentNode.insertBefore(row, row.previousElementSibling);
        break;
      case "down":
        if (row.nextElementSibling) row.parentNode.insertBefore(row.nextElementSibling, row);
        break;
      case "media":
        pickMedia(button);
        break;
    }
  });

  // Keep image previews in sync with the URL field.
  document.addEventListener("input", function (event) {
    if (!event.target.classList.contains("tvgf-media__input")) return;
    var preview = event.target.closest(".tvgf-field").querySelector(".tvgf-media__preview");
    if (!preview) return;
    preview.src = event.target.value;
    preview.hidden = !event.target.value;
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  // === Sentiment Selection ===
  const sentimentOptions = document.querySelectorAll(".sentiment-option");
  sentimentOptions.forEach((option) => {
    option.addEventListener("click", function () {
      sentimentOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  const form = document.getElementById("newEntryForm");
  const entriesListContainer = document.querySelector(
    ".entries-list .entry-cards-container",
  );
  const emptyState = document.querySelector(".entries-list .empty-state");

  // === Filter Controls (New) ===
  const sentimentFilter = document.getElementById("sentimentFilter");
  const startDateFilter = document.getElementById("startDateFilter");
  const endDateFilter = document.getElementById("endDateFilter");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  function renderEntryCard(entry) {
    const entryCard = document.createElement("div");
    entryCard.classList.add("entry-card");
    entryCard.dataset.id = entry._id;

    const entryDate = formatDate(entry.date);

    // Build DOM safely (no innerHTML with user data)
    const header = document.createElement("div");
    header.className = "entry-header";

    const h4 = document.createElement("h4");
    h4.textContent = entry.title;

    const sentimentSpan = document.createElement("span");
    sentimentSpan.className = "entry-sentiment " + entry.sentiment;
    sentimentSpan.textContent =
      entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1);

    header.appendChild(h4);
    header.appendChild(sentimentSpan);

    const dateDiv = document.createElement("div");
    dateDiv.className = "entry-date";
    dateDiv.textContent = entryDate;

    const contentP = document.createElement("p");
    contentP.className = "entry-content";
    contentP.textContent = entry.content;

    const actions = document.createElement("div");
    actions.className = "entry-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    entryCard.appendChild(header);
    entryCard.appendChild(dateDiv);
    entryCard.appendChild(contentP);
    entryCard.appendChild(actions);

    return entryCard;
  }

  function renderEditForm(entry) {
    const form = document.createElement("form");
    form.className = "edit-entry-form";
    form.dataset.id = entry._id;

    // Title field
    const titleGroup = document.createElement("div");
    titleGroup.className = "form-group";
    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "editTitle-" + entry._id);
    titleLabel.textContent = "Title";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "editTitle-" + entry._id;
    titleInput.value = entry.title;
    titleInput.required = true;
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);

    // Content field
    const contentGroup = document.createElement("div");
    contentGroup.className = "form-group";
    const contentLabel = document.createElement("label");
    contentLabel.setAttribute("for", "editContent-" + entry._id);
    contentLabel.textContent = "How were you feeling?";
    const contentTextarea = document.createElement("textarea");
    contentTextarea.id = "editContent-" + entry._id;
    contentTextarea.required = true;
    contentTextarea.textContent = entry.content;
    contentGroup.appendChild(contentLabel);
    contentGroup.appendChild(contentTextarea);

    // Mood selector
    const moodGroup = document.createElement("div");
    moodGroup.className = "form-group";
    const moodLabel = document.createElement("label");
    moodLabel.textContent = "Mood";
    moodGroup.appendChild(moodLabel);

    const selector = document.createElement("div");
    selector.className = "sentiment-selector";
    ["positive", "neutral", "negative"].forEach(function (s) {
      const opt = document.createElement("div");
      opt.className =
        "sentiment-option " + s + (entry.sentiment === s ? " selected" : "");
      opt.dataset.sentiment = s;
      const icon = document.createElement("i");
      icon.className =
        "fas fa-" +
        (s === "positive" ? "smile" : s === "neutral" ? "meh" : "frown");
      const label = document.createElement("div");
      label.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      opt.appendChild(icon);
      opt.appendChild(label);
      selector.appendChild(opt);
    });
    moodGroup.appendChild(selector);

    // Actions
    const actions = document.createElement("div");
    actions.className = "entry-actions";
    actions.style.justifyContent = "flex-start";
    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.className = "btn small";
    saveBtn.textContent = "Save Changes";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn small btn-secondary cancel-edit";
    cancelBtn.textContent = "Cancel";
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    form.appendChild(titleGroup);
    form.appendChild(contentGroup);
    form.appendChild(moodGroup);
    form.appendChild(actions);

    return form;
  }

  function addEntryActionListeners() {
    const deleteButtons = entriesListContainer.querySelectorAll(".delete-btn");
    const editButtons = entriesListContainer.querySelectorAll(".edit-btn");

    deleteButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const entryCard = button.closest(".entry-card");
        const entryId = entryCard.dataset.id;

        if (confirm("Are you sure you want to delete this entry?")) {
          try {
            const response = await fetch(`/api/entries/${entryId}`, {
              method: "DELETE",
            });

            if (response.ok) {
              console.log("Entry deleted successfully:", entryId);
              entryCard.remove();

              if (entriesListContainer.children.length === 0) {
                emptyState.style.display = "block";
                entriesListContainer.style.display = "none";
              }
            } else {
              const errorData = await response.json();
              alert(
                `Error deleting entry: ${errorData.message || response.statusText}`,
              );
            }
          } catch (error) {
            alert("Network error: Could not delete entry.");
          }
        }
      });
    });

    editButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const entryCard = button.closest(".entry-card");
        const entryId = entryCard.dataset.id;

        try {
          const response = await fetch(`/api/entries/${entryId}`);
          const entry = await response.json();

          const editForm = renderEditForm(entry);
          entryCard.replaceWith(editForm);

          const formSentiments = editForm.querySelectorAll(".sentiment-option");
          formSentiments.forEach((opt) => {
            opt.addEventListener("click", function () {
              formSentiments.forEach((o) => o.classList.remove("selected"));
              this.classList.add("selected");
            });
          });

          editForm
            .querySelector(".cancel-edit")
            .addEventListener("click", () => {
              const originalCard = renderEntryCard(entry);
              editForm.replaceWith(originalCard);
              addEntryActionListeners();
            });

          editForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const updatedTitle = editForm.querySelector(
              `#editTitle-${entryId}`,
            ).value;
            const updatedContent = editForm.querySelector(
              `#editContent-${entryId}`,
            ).value;
            const selectedMood = editForm.querySelector(
              ".sentiment-option.selected",
            )?.dataset.sentiment;

            if (!updatedTitle || !updatedContent || !selectedMood) {
              alert("Please fill in all fields and select a mood.");
              return;
            }

            try {
              const updateResponse = await fetch(`/api/entries/${entryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: updatedTitle,
                  content: updatedContent,
                  sentiment: selectedMood,
                }),
              });

              if (updateResponse.ok) {
                const updatedEntry = await updateResponse.json();
                const updatedCard = renderEntryCard(updatedEntry);
                editForm.replaceWith(updatedCard);
                addEntryActionListeners();
              } else {
                const err = await updateResponse.json();
                alert(
                  `Failed to update: ${err.message || updateResponse.statusText}`,
                );
              }
            } catch (err) {
              alert("Network error: Could not update entry.");
            }
          });
        } catch (err) {
          alert("Could not load entry for editing.");
        }
      });
    });
  }

  async function fetchAndDisplayEntries() {
    try {
      const selectedSentiment = sentimentFilter?.value;
      const startDate = startDateFilter?.value;
      const endDate = endDateFilter?.value;

      const queryParams = new URLSearchParams();

      if (selectedSentiment) queryParams.append("sentiment", selectedSentiment);
      if (startDate)
        queryParams.append("startDate", new Date(startDate).toISOString());
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        queryParams.append("endDate", end.toISOString());
      }

      const url = `/api/entries?${queryParams.toString()}`;
      const response = await fetch(url);

      if (response.ok) {
        const entries = await response.json();
        entriesListContainer.innerHTML = "";

        if (entries.length === 0) {
          emptyState.style.display = "block";
          entriesListContainer.style.display = "none";
          emptyState.innerHTML =
            selectedSentiment || startDate || endDate
              ? `<i class="fas fa-box-open"></i><h4>No entries match your filters.</h4><p>Try adjusting your filter options.</p>`
              : `<i class="fas fa-journal-whills"></i><h4>No entries yet!</h4><p>Start by writing your first journal entry above.</p>`;
        } else {
          emptyState.style.display = "none";
          entriesListContainer.style.display = "block";

          entries.forEach((entry) => {
            const card = renderEntryCard(entry);
            entriesListContainer.appendChild(card);
          });

          addEntryActionListeners();
        }
      } else {
        const err = await response.json();
        emptyState.innerHTML = `<i class="fas fa-exclamation-circle"></i><h4>Error loading entries</h4><p>${err.message}</p>`;
        emptyState.style.display = "block";
        entriesListContainer.style.display = "none";
      }
    } catch (err) {
      emptyState.innerHTML = `<i class="fas fa-exclamation-circle"></i><h4>Network Error</h4><p>Could not load entries.</p>`;
      emptyState.style.display = "block";
      entriesListContainer.style.display = "none";
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const titleInput = document.getElementById("entryTitle");
    const contentInput = document.getElementById("entryContent");
    const selectedSentimentOption = document.querySelector(
      ".sentiment-option.selected",
    );

    const title = titleInput.value;
    const content = contentInput.value;
    const sentiment = selectedSentimentOption
      ? selectedSentimentOption.dataset.sentiment
      : null;

    if (!title || !content || !sentiment) {
      alert("Please fill in all fields and select a mood.");
      return;
    }

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, sentiment }),
      });

      if (response.ok) {
        titleInput.value = "";
        contentInput.value = "";
        sentimentOptions.forEach((opt) => opt.classList.remove("selected"));
        fetchAndDisplayEntries();
      } else {
        const err = await response.json();
        alert(`Error saving entry: ${err.message || response.statusText}`);
      }
    } catch (err) {
      alert("Network error: Could not connect to the server.");
    }
  });

  // === Attach event listeners to filters ===
  if (sentimentFilter && startDateFilter && endDateFilter) {
    sentimentFilter.addEventListener("change", fetchAndDisplayEntries);
    startDateFilter.addEventListener("change", fetchAndDisplayEntries);
    endDateFilter.addEventListener("change", fetchAndDisplayEntries);
  }

  fetchAndDisplayEntries();
});

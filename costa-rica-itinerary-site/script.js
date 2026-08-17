const buttons = document.querySelectorAll(".tab-button");
const panels = document.querySelectorAll(".itinerary");
const pricingCards = document.querySelectorAll("[data-pricing-card]");

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function activateTab(target, updateHash = false, scrollToPanel = false) {
  const selectedButton = document.querySelector(`.tab-button[data-target="${target}"]`);
  const selectedPanel = document.getElementById(target);

  if (!selectedButton || !selectedPanel) return;

  buttons.forEach((item) => {
    const isActive = item === selectedButton;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  panels.forEach((panel) => {
    const isActive = panel === selectedPanel;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  if (updateHash) {
    history.replaceState(null, "", `#${target}`);
  }

  if (scrollToPanel) {
    selectedPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    activateTab(button.dataset.target, true, true);
  });

  button.addEventListener("keydown", (event) => {
    const currentIndex = Array.from(buttons).indexOf(button);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % buttons.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = buttons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextButton = buttons[nextIndex];
    nextButton.focus();
    activateTab(nextButton.dataset.target, true);
  });
});

const initialTarget = window.location.hash.replace("#", "");
if (initialTarget) {
  activateTab(initialTarget);
} else {
  activateTab("adventure");
}

window.addEventListener("hashchange", () => {
  activateTab(window.location.hash.replace("#", ""));
});

pricingCards.forEach((card) => {
  const stagedSelects = Array.from(card.querySelectorAll("[data-stage-select]"));
  const select = card.querySelector("[data-price-select]");
  const priceOutput = card.querySelector("[data-price-output]");
  const buildOutput = card.querySelector("[data-build-output]");

  if (!priceOutput || !buildOutput) return;

  if (stagedSelects.length) {
    const priceMap = JSON.parse(card.dataset.priceMap || "{}");
    const fixedBuilds = Array.from(card.querySelectorAll("[data-fixed-build]"))
      .map((item) => item.dataset.fixedBuild)
      .filter(Boolean);

    const getKey = () => stagedSelects.map((stageSelect) => stageSelect.value).join("|");

    const isValidPartial = (stageIndex, optionValue) => {
      const values = stagedSelects.map((stageSelect, index) => (
        index === stageIndex ? optionValue : stageSelect.value
      ));

      return Object.keys(priceMap).some((key) => {
        const parts = key.split("|");
        return values.every((value, index) => parts[index] === value);
      });
    };

    const syncAvailableOptions = () => {
      stagedSelects.forEach((stageSelect, stageIndex) => {
        Array.from(stageSelect.options).forEach((option) => {
          option.disabled = !isValidPartial(stageIndex, option.value);
        });
      });

      if (!priceMap[getKey()]) {
        const lastSelect = stagedSelects[stagedSelects.length - 1];
        const validOption = Array.from(lastSelect.options).find((option) => !option.disabled);

        if (validOption) {
          lastSelect.value = validOption.value;
        }
      }
    };

    const updateStagedPricing = () => {
      syncAvailableOptions();

      const selectedPrice = Number(priceMap[getKey()]);
      const selectedBuilds = stagedSelects.map((stageSelect) => {
        const selectedOption = stageSelect.options[stageSelect.selectedIndex];
        return selectedOption.dataset.build || selectedOption.textContent.trim();
      });
      const middleIndex = selectedBuilds.length > 1 ? 1 : selectedBuilds.length;
      const fullBuild = [
        ...selectedBuilds.slice(0, middleIndex),
        ...fixedBuilds,
        ...selectedBuilds.slice(middleIndex),
      ].join(" + ");

      priceOutput.textContent = currencyFormatter.format(selectedPrice);
      buildOutput.textContent = fullBuild;
    };

    stagedSelects.forEach((stageSelect) => {
      stageSelect.addEventListener("change", updateStagedPricing);
    });
    updateStagedPricing();
    return;
  }

  if (!select) return;

  const updatePricing = () => {
    const selectedOption = select.options[select.selectedIndex];
    const selectedPrice = Number(selectedOption.value);

    priceOutput.textContent = currencyFormatter.format(selectedPrice);
    buildOutput.textContent = selectedOption.dataset.build || selectedOption.textContent;
  };

  select.addEventListener("change", updatePricing);
  updatePricing();
});

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  const label = link.getAttribute("aria-label") || link.textContent.trim();

  if (label && !/opens in a new tab/i.test(label)) {
    link.setAttribute("aria-label", `${label} - opens in a new tab`);
  }
});

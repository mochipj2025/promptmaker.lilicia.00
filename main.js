function renderForm() {
  const area = document.getElementById('form-area');
  area.innerHTML = '';
  categoryMeta.forEach(cat => {
    // カード外枠
    const card = document.createElement('div');
    card.className = "category-card";

    // カテゴリ見出し（アコーディオンボタン）
    const header = document.createElement('button');
    header.className = "cat-accordion";
    header.type = "button";
    header.textContent = cat.label;
    header.setAttribute("aria-expanded", "false");

    // パネル部
    const panel = document.createElement('div');
    panel.className = "cat-panel";
    panel.style.display = "none";

    header.onclick = function () {
      const isOpen = panel.style.display === "block";
      panel.style.display = isOpen ? "none" : "block";
      header.classList.toggle('active', !isOpen);
    };

    // プルダウン or チェックボックス
    if (cat.selectType === "single") {
      const select = document.createElement('select');
      select.name = cat.name;
      select.onchange = updatePrompt;
      select.appendChild(new Option("未選択", ""));
      loadedData[cat.name].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
      });
      panel.appendChild(select);
    } else {
      loadedData[cat.name].forEach(opt => {
        const id = `${cat.name}_${opt.value}`;
        const input = document.createElement('input');
        input.type = "checkbox";
        input.id = id;
        input.name = cat.name;
        input.value = opt.value;
        input.addEventListener('change', updatePrompt);

        const lab = document.createElement('label');
        lab.htmlFor = id;
        lab.textContent = opt.label;
        lab.className = "checkbox-label";
        panel.appendChild(input);
        panel.appendChild(lab);
      });
    }
    card.appendChild(header);
    card.appendChild(panel);
    area.appendChild(card);
  });
}

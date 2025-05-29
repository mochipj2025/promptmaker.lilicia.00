const FIXED_PROMPT = [
  "score_9", "score_8_up", "score_7_up", "photorealistic", "real human texture",
  "dslr", "soft focus", "film grain", "candid moment", "subtle imperfections",
  "Lilithia", "silver hair", "medium length, layered hairstyle", "golden eyes",
  "sexy and cute face", "large breasts", "slim waist", "alluring", "confident",
  "does not resist desire", "goddess of lust", "succubus queen"
].join(', ');

const FIXED_NEGATIVE_PROMPT = [
  "score_6", "score_5", "score_4", "simplified", "abstract", "unrealistic", "impressionistic",
  "low resolution", "((adult body))", "lowres", "bad anatomy", "bad hands", "missing fingers",
  "worst quality", "low quality", "normal quality", "cartoon", "anime", "drawing", "sketch",
  "illustration", "artificial", "poor quality"
].join(', ');

const categoryMeta = [
  { name: "tops", label: "トップス", selectType: "multiple" },
  { name: "bottoms", label: "ボトムス", selectType: "multiple" },
  { name: "onepiece", label: "ワンピース", selectType: "multiple" },
  { name: "outer", label: "アウター", selectType: "multiple" },
  { name: "lingerie", label: "ランジェリー", selectType: "multiple" },
  { name: "footwear", label: "靴・レッグウェア", selectType: "multiple" },
  { name: "material", label: "素材", selectType: "single" },
  { name: "accessory", label: "装飾品", selectType: "multiple" },
  { name: "fetish", label: "フェティッシュ", selectType: "multiple" },
  { name: "cosplay", label: "コスプレ", selectType: "multiple" },
  { name: "masturbation_pose", label: "マスターベーション", selectType: "multiple" },
  { name: "pose_normal", label: "通常ポーズ", selectType: "single" },
  { name: "antique_weapons", label: "アンティーク武器", selectType: "multiple" },
  { name: "camera_work", label: "カメラワーク", selectType: "single" },
  { name: "lighting", label: "ライティング", selectType: "multiple" },
  { name: "background", label: "背景", selectType: "single" },
  { name: "effect", label: "演出エフェクト", selectType: "multiple" }
];

const loadedData = {};
window.onload = async function() {
  for (const cat of categoryMeta) {
    const res = await fetch(`data/${cat.name}.json`);
    loadedData[cat.name] = await res.json();
  }
  renderForm();
  updatePrompt();
  document.getElementById('negprompt-output').value = FIXED_NEGATIVE_PROMPT;
};

function renderForm() {
  const area = document.getElementById('form-area');
  area.innerHTML = '';
  categoryMeta.forEach((cat, idx) => {
    // アコーディオン見出し
    const accHead = document.createElement('button');
    accHead.className = "accordion";
    accHead.type = "button";
    accHead.textContent = cat.label;
    accHead.setAttribute("aria-expanded", "false");
    accHead.onclick = function() {
      this.classList.toggle("active");
      panel.style.display = panel.style.display === "block" ? "none" : "block";
      this.setAttribute("aria-expanded", panel.style.display === "block");
    };
    area.appendChild(accHead);

    // アコーディオンパネル
    const panel = document.createElement('div');
    panel.className = "panel";
    panel.style.display = "none";

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
        panel.appendChild(input);
        panel.appendChild(lab);
        panel.appendChild(document.createElement('br'));
      });
    }
    area.appendChild(panel);
  });
}

function updatePrompt() {
  let prompt = [FIXED_PROMPT];
  categoryMeta.forEach(cat => {
    if (cat.selectType === "single") {
      const sel = document.querySelector(`select[name="${cat.name}"]`);
      if (sel && sel.value) {
        const option = loadedData[cat.name].find(o => o.value === sel.value);
        if (option) prompt.push(option.label);
      }
    } else {
      const checked = Array.from(document.querySelectorAll(`input[name="${cat.name}"]:checked`));
      checked.forEach(el => {
        const option = loadedData[cat.name].find(o => o.value === el.value);
        if (option) prompt.push(option.label);
      });
    }
  });
  document.getElementById('prompt-output').value = prompt.join(', ');
}

// コピー機能
document.getElementById('copy-prompt').onclick = function() {
  const ta = document.getElementById('prompt-output');
  ta.select();
  document.execCommand('copy');
};
document.getElementById('copy-negprompt').onclick = function() {
  const ta = document.getElementById('negprompt-output');
  ta.select();
  document.execCommand('copy');
};

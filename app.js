/* =========================
   Student-Trained Chatbot
   ========================= */

   const STORAGE_KEY = "student_kb_v1";

   /* -------- DOM -------- */
   const chatWindow = document.getElementById("chatWindow");
   const userInput = document.getElementById("userInput");
   const sendBtn = document.getElementById("sendBtn");
   const kbCount = document.getElementById("kbCount");
   
   const adminBtn = document.getElementById("adminBtn");
   const resetBtn = document.getElementById("resetBtn");
   const adminModal = document.getElementById("adminModal");
   const closeAdminBtn = document.getElementById("closeAdminBtn");
   
   const searchInput = document.getElementById("searchInput");
   const categoryFilter = document.getElementById("categoryFilter");
   const exportBtn = document.getElementById("exportBtn");
   const importInput = document.getElementById("importInput");
   
   const formTitle = document.getElementById("formTitle");
   const categoryInput = document.getElementById("categoryInput");
   const questionInput = document.getElementById("questionInput");
   const answerInput = document.getElementById("answerInput");
   const tagsInput = document.getElementById("tagsInput");
   const saveBtn = document.getElementById("saveBtn");
   const cancelEditBtn = document.getElementById("cancelEditBtn");
   
   const kbList = document.getElementById("kbList");
   
   /* -------- State -------- */
   let kb = [];
   let editingId = null;
   
   /* -------- Utilities -------- */
   function uid() {
     return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
   }
   
   function normalize(text) {
     return (text || "")
       .toLowerCase()
       .replace(/[?.!,]/g, "")
       .replace(/\s+/g, " ")
       .trim();
   }
   
   function parseTags(raw) {
     return (raw || "")
       .split(",")
       .map(t => normalize(t))
       .filter(Boolean);
   }
   
   function saveKB() {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(kb));
     kbCount.textContent = String(kb.length);
   }
   
   function loadKB() {
     const saved = localStorage.getItem(STORAGE_KEY);
     if (saved) {
       try {
         kb = JSON.parse(saved);
       } catch {
         kb = [];
       }
     }
   
     // If first time, add starter data
     if (!Array.isArray(kb) || kb.length === 0) {
       kb = [
         {
           id: uid(),
           category: "US Geography",
           q: "How many states are there in the US?",
           a: "There are 50 states in the US, with 13 states known as the 13 colonies.",
           tags: ["dns", "domain", "ip"]
         },
         {
           id: uid(),
           category: "Networking",
           q: "what is ping",
           a: "Ping tests connectivity by sending ICMP echo requests and measuring response time.",
           tags: ["ping", "icmp", "network"]
         },
         {
           id: uid(),
           category: "Web",
           q: "what is an api",
           a: "An API is a way for programs to communicate and share data or functions.",
           tags: ["api", "json", "http"]
         }
       ];
       saveKB();
     } else {
       kbCount.textContent = String(kb.length);
     }
   }
   
   /* -------- Chat UI -------- */
   function addChatMessage(text, who) {
     const div = document.createElement("div");
     div.className = `msg ${who}`;
     div.textContent = text;
     chatWindow.appendChild(div);
     chatWindow.scrollTop = chatWindow.scrollHeight;
   }
   
   /* -------- Similarity Scoring (teachable) --------
      Jaccard similarity on word sets, plus tag/category boost.
   */
   function jaccardScore(a, b) {
     const setA = new Set(normalize(a).split(" ").filter(Boolean));
     const setB = new Set(normalize(b).split(" ").filter(Boolean));
     if (setA.size === 0 || setB.size === 0) return 0;
   
     let inter = 0;
     for (const w of setA) if (setB.has(w)) inter++;
   
     const union = new Set([...setA, ...setB]).size;
     return union === 0 ? 0 : inter / union;
   }
   
   function computeScore(userQ, item) {
     let score = jaccardScore(userQ, item.q);
   
     // Tag boost: if user mentions any tag word, increase confidence
     const uq = normalize(userQ);
     if (item.tags && item.tags.length > 0) {
       for (const t of item.tags) {
         if (t && uq.includes(t)) score += 0.08;
       }
     }
   
     // Category boost: if user mentions category word
     const cat = normalize(item.category);
     if (cat && uq.includes(cat)) score += 0.05;
   
     // Cap at 1
     return Math.min(1, score);
   }
   
   function findBestMatch(userQ, filteredItems) {
     let best = { item: null, score: 0 };
     for (const item of filteredItems) {
       const s = computeScore(userQ, item);
       if (s > best.score) best = { item, score: s };
     }
     return best;
   }
   
   /* -------- Bot Logic -------- */
   function getFilteredKBForChat(userQ) {
     // In future, you can filter by category automatically.
     // For now, use all entries.
     return kb;
   }
   
   function botAnswer(userText) {
     const items = getFilteredKBForChat(userText);
     const { item, score } = findBestMatch(userText, items);
   
     const THRESHOLD = 0.36; // tune this for your class
   
     if (item && score >= THRESHOLD) {
       const pct = Math.round(score * 100);
       return `${item.a}\n\nCategory: ${item.category}\nConfidence: ${pct}%`;
     }
   
     return (
       "I’m not confident about that yet.\n" +
       "Please inform aditibaral114@gmail.com know"
     );
   }
   
   /* -------- Admin Panel UI -------- */
   function openAdmin() {
     adminModal.classList.remove("hidden");
     adminModal.setAttribute("aria-hidden", "false");
     renderCategoryFilter();
     renderKBList();
   }
   
   function closeAdmin() {
     adminModal.classList.add("hidden");
     adminModal.setAttribute("aria-hidden", "true");
     clearForm();
   }
   
   function clearForm() {
     editingId = null;
     formTitle.textContent = "Add New Q/A";
     categoryInput.value = "";
     questionInput.value = "";
     answerInput.value = "";
     tagsInput.value = "";
     cancelEditBtn.classList.add("hidden");
   }
   
   function renderCategoryFilter() {
     const categories = Array.from(new Set(kb.map(x => x.category).filter(Boolean))).sort();
     const current = categoryFilter.value;
   
     categoryFilter.innerHTML = `<option value="">All Categories</option>`;
     for (const c of categories) {
       const opt = document.createElement("option");
       opt.value = c;
       opt.textContent = c;
       categoryFilter.appendChild(opt);
     }
   
     // Restore selection if possible
     if (categories.includes(current)) categoryFilter.value = current;
   }
   
   function matchesFilters(item) {
     const search = normalize(searchInput.value);
     const cat = categoryFilter.value;
   
     if (cat && item.category !== cat) return false;
   
     if (search) {
       const hay = [
         item.category,
         item.q,
         item.a,
         (item.tags || []).join(" ")
       ].join(" ").toLowerCase();
   
       return hay.includes(search);
     }
   
     return true;
   }
   
   function renderKBList() {
     kbList.innerHTML = "";
   
     const items = kb.filter(matchesFilters);
   
     if (items.length === 0) {
       const empty = document.createElement("div");
       empty.className = "small-note";
       empty.textContent = "No items match your filters. Add a new Q/A on the left.";
       kbList.appendChild(empty);
       return;
     }
   
     for (const item of items) {
       const card = document.createElement("div");
       card.className = "kb-item";
   
       const meta = document.createElement("div");
       meta.className = "meta";
       meta.innerHTML = `
         <span class="badge">Category: ${item.category || "None"}</span>
         <span class="badge">Tags: ${(item.tags || []).join(", ") || "None"}</span>
       `;
   
       const q = document.createElement("div");
       q.className = "q";
       q.textContent = item.q;
   
       const a = document.createElement("div");
       a.className = "a";
       a.textContent = item.a;
   
       const actions = document.createElement("div");
       actions.className = "kb-actions";
   
       const edit = document.createElement("button");
       edit.textContent = "Edit";
       edit.addEventListener("click", () => startEdit(item.id));
   
       const del = document.createElement("button");
       del.textContent = "Delete";
       del.classList.add("danger");
       del.addEventListener("click", () => deleteItem(item.id));
   
       actions.appendChild(edit);
       actions.appendChild(del);
   
       card.appendChild(meta);
       card.appendChild(q);
       card.appendChild(a);
       card.appendChild(actions);
   
       kbList.appendChild(card);
     }
   }
   
   function startEdit(id) {
     const item = kb.find(x => x.id === id);
     if (!item) return;
   
     editingId = id;
     formTitle.textContent = "Edit Q/A";
     categoryInput.value = item.category || "";
     questionInput.value = item.q || "";
     answerInput.value = item.a || "";
     tagsInput.value = (item.tags || []).join(", ");
     cancelEditBtn.classList.remove("hidden");
   }
   
   function deleteItem(id) {
     kb = kb.filter(x => x.id !== id);
     saveKB();
     renderCategoryFilter();
     renderKBList();
     clearForm();
   }
   
   function saveForm() {
     const category = (categoryInput.value || "").trim() || "General";
     const q = normalize(questionInput.value);
     const a = (answerInput.value || "").trim();
     const tags = parseTags(tagsInput.value);
   
     if (!q || !a) {
       alert("Please enter both Question and Answer.");
       return;
     }
   
     if (editingId) {
       const item = kb.find(x => x.id === editingId);
       if (!item) return;
   
       item.category = category;
       item.q = q;
       item.a = a;
       item.tags = tags;
     } else {
       kb.push({ id: uid(), category, q, a, tags });
     }
   
     saveKB();
     renderCategoryFilter();
     renderKBList();
     clearForm();
   }
   
   /* -------- Import/Export -------- */
   function exportJSON() {
     const data = JSON.stringify(kb, null, 2);
     const blob = new Blob([data], { type: "application/json" });
     const url = URL.createObjectURL(blob);
   
     const a = document.createElement("a");
     a.href = url;
     a.download = "student-chatbot-knowledgebase.json";
     document.body.appendChild(a);
     a.click();
     a.remove();
   
     URL.revokeObjectURL(url);
   }
   
   function importJSONFile(file) {
     const reader = new FileReader();
     reader.onload = () => {
       try {
         const parsed = JSON.parse(reader.result);
         if (!Array.isArray(parsed)) {
           alert("Invalid JSON: expected an array of Q/A items.");
           return;
         }
   
         // Minimal validation + normalization
         const cleaned = parsed
           .map(x => ({
             id: x.id || uid(),
             category: (x.category || "General").trim(),
             q: normalize(x.q || ""),
             a: (x.a || "").trim(),
             tags: Array.isArray(x.tags) ? x.tags.map(t => normalize(t)).filter(Boolean) : []
           }))
           .filter(x => x.q && x.a);
   
         if (cleaned.length === 0) {
           alert("No valid Q/A items found in this JSON.");
           return;
         }
   
         kb = cleaned;
         saveKB();
         renderCategoryFilter();
         renderKBList();
         clearForm();
         alert("Import successful!");
       } catch (e) {
         alert("Import failed. Make sure the file is valid JSON.");
       }
     };
     reader.readAsText(file);
   }
   
   /* -------- Reset -------- */
   function resetAllData() {
     const ok = confirm("Reset will delete all saved Q/A data on this browser. Continue?");
     if (!ok) return;
   
     localStorage.removeItem(STORAGE_KEY);
     loadKB();
     renderCategoryFilter();
     renderKBList();
     chatWindow.innerHTML = "";
     addChatMessage("Data reset. Add new Q/A in Admin Panel to train the bot again.", "bot");
   }
   
   /* -------- Events -------- */
   function handleSend() {
     const text = userInput.value.trim();
     if (!text) return;
   
     addChatMessage(text, "user");
     userInput.value = "";
   
     const response = botAnswer(text);
     addChatMessage(response, "bot");
   }
   
   sendBtn.addEventListener("click", handleSend);
   userInput.addEventListener("keydown", (e) => {
     if (e.key === "Enter") handleSend();
   });
   
   adminBtn.addEventListener("click", openAdmin);
   closeAdminBtn.addEventListener("click", closeAdmin);
   adminModal.addEventListener("click", (e) => {
     if (e.target === adminModal) closeAdmin();
   });
   
   saveBtn.addEventListener("click", saveForm);
   cancelEditBtn.addEventListener("click", clearForm);
   
   searchInput.addEventListener("input", renderKBList);
   categoryFilter.addEventListener("change", renderKBList);
   
   exportBtn.addEventListener("click", exportJSON);
   importInput.addEventListener("change", (e) => {
     const file = e.target.files?.[0];
     if (file) importJSONFile(file);
     e.target.value = ""; // allow re-import same file
   });
   
   resetBtn.addEventListener("click", resetAllData);
   
   /* -------- Init -------- */
   loadKB();
   kbCount.textContent = String(kb.length);
   
   addChatMessage(
     "Hi! I am a student-trained bot.\n" +
     "If I don’t know something, then please let know aditibaral114@gmail.com.\n" +
     "You can also improve me by adding other Q/A in the Admin Panel for others to learn.",
     "bot"
   );

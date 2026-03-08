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
           a: "The United States of America is a federal republic consisting of 50 states. While often confused by some, the official count is exactly 50, not 52. These 50 states are the primary constituent units of the country. The first state to ratify the Constitution was Delaware on December 7, 1787. The most recent state to join the union was Hawaii on August 21, 1959. These states operate under the U.S. Constitution, which grants them significant, non-delegated powers. Besides the 50 states, the country includes the federal district of Washington, D.C., which serves as the capital city. The nation also oversees five major territories, including Puerto Rico and Guam. The 48 contiguous states are located in North America between Canada and Mexico. Alaska is situated in the northwest, separated from the mainland. Hawaii is a chain of islands located in the central Pacific Ocean. Each state has its own unique constitution, government, and governor. The states are collectively represented in the federal Congress, which consists of the Senate and the House of Representatives. The smallest state by land area is Rhode Island, while Alaska is the largest. The most populous state is California. The population is distributed unevenly, with major concentration on both the East and West Coasts. Every state has a unique, designated state capital, which is not always its largest city. A common misconception arises from confusing the 50 states with territories, leading to the false notion of 52 states. These 50 states span a diverse range of geography, from the Atlantic to the Pacific Ocean. Understanding this structure helps to understand the federal nature of the United States. Therefore, the definitive answer is 50 states.",
           tags: ["US Geography", "How many states are there in the US"]
         },
         {
           id: uid(),
           category: "World Geography",
           q: "What is the largest volcano on Earth?",
           a: "The largest active volcano in the world by both volume and area is Mauna Loa, located on the Big Island of Hawaii. Meaning Long Mountain in Hawaiian, it is a massive shield volcano that constitutes over half of the island's landmass. While its summit reaches 13,680 feet above sea level, the bulk of the mountain lies beneath the ocean, making it truly gigantic. When measured from its base on the sea floor to its summit, it rises over 30,000 feet (9,170 meters), which is taller than Mount Everest. It is part of the Hawaiian hot spot, a region where magma rises through the Pacific tectonic plate to create a chain of volcanoes. Mauna Loa has a total estimated volume of at least 18,000 cubic miles (75,000 km³), solidifying its title as the largest active volcano on Earth. Although it is exceptionally large, it is not the most active, a title held by its neighbor, Kilauea. However, Mauna Loa is historically dangerous; it has erupted 34 times since 1843. The most recent eruption occurred in November 2022, marking its first activity since 1984. It is a shield volcano, characterized by broad, gently sloping sides built by countless, low-viscosity lava flows. It is important to note that while Mauna Loa is the largest active volcano, other, older volcanic features are technically larger, such as Tamu Massif in the Pacific Ocean, which is now considered inactive. Furthermore, in the context of the entire solar system, the largest volcano is Olympus Mons on Mars. Still, for active volcanoes on Earth, Mauna Loa remains unrivaled in size. It is a critical subject for scientific study, as researchers monitor its seismic activity to predict future eruptions. The volcano also plays a significant role in climate research, with atmospheric monitoring taking place at its summit. Its immense mass actually depresses the Earth's crust beneath it by several kilometers. The surrounding area, featuring the Hawaii Volcanoes National Park, highlights the dramatic landscape shaped by this giant. Despite its size and power, Mauna Loa is a popular location for scientific study and, when safe, tourism. It remains a dominant, active force in the Pacific, standing as a testament to the power of hotspots.",
           tags: ["World Geography", "What is the largest volcano on Earth"]
         },
         {
           id: uid(),
           category: "Fashion",
           q: "How can you style a white shirt?",
           a: "Styling a white shirt is a fundamental skill in both modern fashion and AI-driven style curation, acting as a versatile blank canvas for any outfit. For a timeless, casual look, pair a crisp white shirt with classic blue jeans, allowing the contrast to create a clean, sharp aesthetic. To achieve a more polished office look, tucked in with tailored trousers or a midi skirt provides an elegant, professional, and functional outfit. An oversized white shirt can be elevated by treating it as a shacket, wearing it unbuttoned over a fitted tee, or, to create a more dramatic silhouette, styling it with a corset or a statement belt. For a chic, monochromatic look, combine a white blouse with white pants or a white skirt, which creates a high-fashion, cohesive, and sophisticated appearance. To add a layer of sophistication, tuck a crisp white button-down into a pleated skirt or pair it with wide-leg pants and trainers. You can also transform a simple white shirt by layering a sweater vest over it, a preppy combination that adds instant visual interest. Another fashionable approach is wearing a white shirt underneath a sleeveless dress or jumpsuit, allowing the collar and cuffs to peek out for a polished touch. When using AI for styling inspiration, prompt the AI to consider the fabric, such as silk for elegance or linen for a breezy summer look, ensuring the style aligns with your intended mood. An AI stylist might suggest pairing a structured, crisp shirt with leather leggings for a daring, high-contrast look that bridges comfort and edginess. To make the white shirt the focal point, pair it with a bright, colorful midi skirt or patterned trousers, making the overall outfit vibrant and eye-catching. Consider changing the silhouette by knotting the shirt at the waist, which pairs excellently with high-waisted shorts or jeans for a playful, bohemian look. For evening, elevate the shirt by adding statement jewelry, such as a bold necklace under the collar, or pairing it with a sequined skirt to create a stunning, high-low fashion ensemble. For a modern dark academia aesthetic, pair a fitted white button-up with a tweed blazer and tailored trousers. The versatility of a white shirt also allows it to be worn back-to-front, offering a unique, avant-garde style, especially with a high-waisted skirt.",
           tags: ["Fashion", "How can you style a white shirt"]
         },
         {
           id: uid(),
           category: "NewJobAsBanker",
           q: "What are the most crucial key performance indicators (KPIs) when being a banker?",
           a: "Being a successful banker requires tracking a mix of financial, operational, and relationship-based metrics to measure performance, profitability, and risk. The most critical KPI for overall profitability is the Net Interest Margin (NIM), which measures the difference between interest earned on loans and interest paid on deposits. Return on Assets (ROA) is equally crucial, as it indicates how efficiently management uses resources to generate profit. For individual performance and relationship managers, Client Acquisition Rate and Customer Lifetime Value (CLV) are vital for measuring growth. Loan-to-Deposit Ratio (LDR) is a key liquidity indicator, showing if a banker is maintaining a healthy balance between lending and deposit-taking. Furthermore, the Non-Performing Loan (NPL) Ratio is essential for monitoring credit quality and risk. Cost-to-Income Ratio gauges operational efficiency and profitability. Bankers must also focus on Fee Income Ratio to diversify revenue beyond interest. Customer Satisfaction (CSAT) and Net Promoter Score (NPS) are critical for measuring customer loyalty. Average Loan Size and Branch Sales Volume are important for branch-level performance. Deposit Growth Rate tracks the ability to attract new funds. For investment bankers, Win Rates and Time to Milestone are key indicators of efficiency. Capital Adequacy Ratio (CAR) is vital for ensuring compliance and stability. Turnaround Time for loan applications measures operational efficiency. Customer Churn Rate measures the loss of clients. Cross-sell Ratios measure the success of selling multiple products to one customer. Interest Rate Spread measures the difference between interest income and interest expense. Risk-Weighted Assets help to manage exposure to market volatility. Finally, tracking Digital Adoption Rate is increasingly necessary to monitor client engagement with digital platforms. These 20 indicators provide a comprehensive overview of a banker's success in driving profitability, managing risk, and strengthening client relationships.",
           tags: ["New Job As Banker", "What are the most crucial key performance indicators (KPIs) when being a banker"]
        },
        {
          id: uid(),
          category: "hi",
          q: "hi",
          a: "Hello! It is a pleasure to connect with you today. I hope you are having a wonderful day so far. As an AI, I am fully prepared to assist you with a wide range of tasks, from drafting content and brainstorming ideas to providing information on virtually any topic you can think of. What is on your mind? If you are looking to start a creative writing project, I can help generate plot points, character sketches, or even draft full scenes. I am capable of mimicking various writing styles and tones, so feel free to provide any specific guidelines you have in mind to get the best possible result. Just let me know the genre or theme. Alternatively, if you are working on something more analytical, I can summarize long documents, create outlines, or help organize complex information into a clear format. I can assist with coding, debugging, or explaining difficult concepts in simple terms. Simply paste the text or code here, and I will get right on it. For those interested in brainstorming, I can provide a list of ideas for marketing campaigns, blog post topics, or gift ideas. I excel at taking a single, small idea and expanding it into a detailed, actionable plan. We can iterate through several possibilities until we find the perfect one for your needs. Whatever the task may be, my goal is to make this process efficient and enjoyable for you. I am ready when you are, so please feel free to share your first prompt, question, or topic. How would you like to proceed?",
          tags: ["hi"]
        }
        {
          id: uid(),
          category: "MakeFoodOrDrink",
          q: "How can I make green smoothies that can make me bright and beautiful?",
          a: "This Radiant Skin Green Smoothie is designed to make you feel bright and beautiful by combining nutrient-dense greens, hydrating coconut water, and skin-loving fruits. The recipe is packed with vitamins A, C, and K, which help to repair skin, reduce inflammation, and promote a natural, healthy glow. Ingredients: 1 cup Almond milk, Lettuce / Spinack / Kale , 1 mango, 1 frozen Banana, 1 / 2 avocado, ginger, dates, protien powder. Make sure you have a high-power blender else the recipe won't work.",
          tags: ["MakeFoodOrDrink", "How can I make green smoothies that can make me bright and beautiful"]

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
       "Please inform aditibaral114@gmail.com"
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
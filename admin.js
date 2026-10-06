const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)],
  uid = () => Date.now().toString(),
  toast = () => {
    $("#toast").classList.add("show");
    setTimeout(() => $("#toast").classList.remove("show"), 2200);
  };
const seed = {
  company: [
    {
      id: "company-1",
      name: "NEXORA",
      headline: "เทคโนโลยีที่<br>ธุรกิจไว้วางใจ",
      intro:
        "ออกแบบ ติดตั้ง และดูแลระบบ IT เพื่อให้ทุกการทำงานของคุณเดินหน้าได้อย่างมั่นใจ",
      aboutTitle: "เทคโนโลยีที่เข้าใจ<br>ธุรกิจของคุณ",
      about:
        "NEXORA คือทีมผู้เชี่ยวชาญด้าน IT ที่ช่วยองค์กรวางระบบให้เหมาะกับการใช้งานจริง ตั้งแต่ระบบเครือข่าย ความปลอดภัย ไปจนถึงโซลูชันสำหรับอาคารและสำนักงาน",
      years: "10+",
      projects: "120+",
      active: true,
    },
  ],
  services: [
    {
      id: "s1",
      title: "Security & CCTV",
      description:
        "ออกแบบและติดตั้งกล้องวงจรปิด ระบบควบคุมการเข้าออก และระบบความปลอดภัย",
      status: "published",
    },
    {
      id: "s2",
      title: "Network Solutions",
      description:
        "วางระบบเครือข่าย Wi-Fi และ Server ที่เสถียร พร้อมรองรับการเติบโต",
      status: "published",
    },
    {
      id: "s3",
      title: "IT Support",
      description: "ดูแลระบบและแก้ปัญหา IT โดยทีมผู้เชี่ยวชาญที่พร้อมช่วยเหลือ",
      status: "published",
    },
  ],
  news: [
    {
      id: "n1",
      title: "ติดตั้งระบบ CCTV ครบวงจร เพื่อความปลอดภัยของพื้นที่ทำงาน",
      category: "PROJECT UPDATE",
      date: "2024-10-12",
      description:
        "ทีมงานของเราเข้าสำรวจพื้นที่ วางแผนจุดติดตั้ง และส่งมอบระบบกล้องวงจรปิดที่ใช้งานง่าย พร้อมอบรมการใช้งานให้กับทีมลูกค้า",
      image: "",
      gallery: [],
      status: "published",
    },
  ],
  contacts: [
    {
      id: "c1",
      type: "Email",
      value: "hello@nexora.co",
      note: "ติดต่อสอบถามโครงการ",
      status: "published",
    },
    {
      id: "c2",
      type: "Phone",
      value: "02 123 4567",
      note: "จันทร์–ศุกร์ 09:00–18:00",
      status: "published",
    },
    {
      id: "c3",
      type: "Address",
      value: "กรุงเทพมหานคร, ประเทศไทย",
      note: "พื้นที่ให้บริการหลัก",
      status: "published",
    },
  ],
};
const key = "nexora-cms-v2";
let db = JSON.parse(localStorage.getItem(key) || "null") || seed;
if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(db));
const save = () => {
  localStorage.setItem(key, JSON.stringify(db));
  render();
  toast();
};
const moduleInfo = {
  company: ["COMPANY PROFILE", "Company profile"],
  services: ["SERVICES", "Services"],
  news: ["NEWS & PROJECTS", "News & projects"],
  contacts: ["CONTACT CHANNELS", "Contact channels"],
};
function go(name) {
  $$(".module").forEach((x) => x.classList.remove("active"));
  $(`#${name}`).classList.add("active");
  $$("nav button").forEach((x) =>
    x.classList.toggle("active", x.dataset.module === name),
  );
  $("#crumb").textContent =
    name === "dashboard" ? "OVERVIEW" : moduleInfo[name][0];
  $("#pageTitle").textContent =
    name === "dashboard" ? "Dashboard" : moduleInfo[name][1];
}
$$("nav button").forEach((b) => (b.onclick = () => go(b.dataset.module)));
$$("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
const icon = { company: "◈", services: "✦", news: "▤", contacts: "⌁" };
const imageOr = (r, type) =>
  type === "news" && r.image
    ? `<img class="thumb" src="${r.image}">`
    : `<div class="iconbox">${icon[type]}</div>`;
function card(r, type) {
  const title =
    type === "company"
      ? r.name
      : type === "services"
        ? r.title
        : type === "news"
          ? r.title
          : r.value;
  const desc =
    type === "company"
      ? r.about
      : type === "services"
        ? r.description
        : type === "news"
          ? `${r.category} · ${r.date} · ${1 + (r.gallery || []).length} รูป`
          : r.type + " · " + r.note;
  const stat =
    type === "company" ? (r.active ? "ACTIVE" : "INACTIVE") : r.status;
  return `<article class="card">${imageOr(r, type)}<div><p class="tag">${type.toUpperCase()}</p><h3>${title}</h3><p>${desc}</p></div><div class="card-actions"><span class="badge ${stat === "draft" || stat === "INACTIVE" ? "draft" : ""}">${stat}</span><button class="edit" data-edit="${type}|${r.id}">Edit →</button></div></article>`;
}
function render() {
  $("#companyList").innerHTML = db.company
    .map((x) => card(x, "company"))
    .join("");
  $("#servicesList").innerHTML = db.services
    .map((x) => card(x, "services"))
    .join("");
  $("#newsList").innerHTML = db.news.map((x) => card(x, "news")).join("");
  $("#contactsList").innerHTML = db.contacts
    .map((x) => card(x, "contacts"))
    .join("");
  $("#countCompany").textContent = db.company.length;
  $("#countServices").textContent = db.services.length;
  $("#countNews").textContent = db.news.filter(
    (x) => x.status === "published",
  ).length;
  $("#countContacts").textContent = db.contacts.length;
}
let type,
  record,
  cover = "",
  gallery = [];
function field(label, id, value = "", kind = "text", wide = false) {
  return `<label class="${wide ? "wide" : ""}">${label}<${kind === "textarea" ? "textarea" : "input"} id="f_${id}" ${kind === "textarea" ? 'rows="4"' : ""} ${kind !== "textarea" ? 'value="' + String(value).replace(/"/g, "&quot;") + '"' : ""}>${kind === "textarea" ? value : ""}</${kind === "textarea" ? "textarea" : "input"}></label>`;
}
function open(t, r) {
  type = t;
  record = r;
  cover = r?.image || "";
  gallery = r?.gallery || [];
  $("#recordId").value = r?.id || "";
  $("#formKicker").textContent = moduleInfo[t][0];
  $("#formTitle").textContent = r ? "Edit record" : `Add ${moduleInfo[t][1]}`;
  $("#delete").style.visibility = r ? "visible" : "hidden";
  let html = '<div class="fields">';
  if (t === "company")
    html +=
      field("ชื่อบริษัท", "name", r?.name || "") +
      field("Headline", "headline", r?.headline || "", "textarea") +
      field("คำอธิบายหน้าแรก", "intro", r?.intro || "", "textarea") +
      field(
        "หัวข้อเกี่ยวกับเรา",
        "aboutTitle",
        r?.aboutTitle || "",
        "textarea",
      ) +
      field("ประวัติบริษัท", "about", r?.about || "", "textarea", true) +
      field("ปีประสบการณ์", "years", r?.years || "") +
      field("โครงการที่ดูแล", "projects", r?.projects || "") +
      `<label>ตั้งเป็นข้อมูลหลัก<select id="f_active"><option value="true">Active</option><option value="false">Inactive</option></select></label>`;
  if (t === "services")
    html +=
      field("ชื่อบริการ", "title", r?.title || "") +
      `<label>สถานะ<select id="f_status"><option value="published">Published</option><option value="draft">Draft</option></select></label>` +
      field(
        "รายละเอียด",
        "description",
        r?.description || "",
        "textarea",
        true,
      );
  if (t === "contacts")
    html +=
      `<label>ประเภท<select id="f_type"><option>Email</option><option>Phone</option><option>Address</option><option>Line</option><option>Facebook</option></select></label>` +
      field("ข้อมูลติดต่อ", "value", r?.value || "") +
      field("คำอธิบาย", "note", r?.note || "", "textarea") +
      `<label>สถานะ<select id="f_status"><option value="published">Published</option><option value="draft">Draft</option></select></label>`;
  if (t === "news")
    html +=
      field("หัวข้อข่าว / ผลงาน", "title", r?.title || "") +
      `<label>หมวดหมู่<select id="f_category"><option>PROJECT UPDATE</option><option>NEWS</option><option>CASE STUDY</option></select></label><label>วันที่เผยแพร่<input id="f_date" type="date" value="${r?.date || new Date().toISOString().slice(0, 10)}"></label><label>สถานะ<select id="f_status"><option value="published">Published</option><option value="draft">Draft</option></select></label>` +
      field(
        "รายละเอียดบทความ",
        "description",
        r?.description || "",
        "textarea",
        true,
      ) +
      `<label class="wide">รูปปก 1 รูป และรูปหน้างานเพิ่มได้ 5 รูป<input id="f_images" type="file" accept="image/*" multiple><span class="hint">เลือกรูปแรกเป็นรูปปก (รูปละไม่เกิน 1.9 MB)</span></label><div class="wide preview" id="preview"></div>`;
  html += "</div>";
  $("#formFields").innerHTML = html;
  if (t === "news") {
    if (r) {
      $("#f_category").value = r.category;
      $("#f_status").value = r.status;
    } else $("#f_status").value = "published";
    showPreview();
    $("#f_images").onchange = readImages;
  }
  if (t === "services" || t === "contacts")
    $("#f_status").value = r?.status || "published";
  if (t === "contacts") $("#f_type").value = r?.type || "Email";
  if (t === "company") $("#f_active").value = String(r?.active ?? true);
  $("#modal").classList.add("show");
}
function showPreview() {
  $("#preview").innerHTML =
    [cover, ...gallery]
      .filter(Boolean)
      .map((x) => `<img src="${x}">`)
      .join("") || "ยังไม่มีรูปภาพ";
}
async function readImages(e) {
  const files = [...e.target.files].slice(0, 6);
  if (files.some((f) => f.size > 1900000)) {
    alert("กรุณาใช้รูปละไม่เกิน 1.9 MB");
    return;
  }
  const images = await Promise.all(
    files.map(
      (f) =>
        new Promise((ok) => {
          const fr = new FileReader();
          fr.onload = () => ok(fr.result);
          fr.readAsDataURL(f);
        }),
    ),
  );
  cover = images[0] || cover;
  gallery = images.slice(1);
  showPreview();
}
$$("[data-add]").forEach((b) => (b.onclick = () => open(b.dataset.add, null)));
document.body.onclick = (e) => {
  const val = e.target.dataset.edit;
  if (val) {
    const [t, id] = val.split("|");
    open(
      t,
      db[t].find((x) => x.id === id),
    );
  }
  if (e.target.classList.contains("close") || e.target.id === "modal")
    $("#modal").classList.remove("show");
};
$("#form").onsubmit = (e) => {
  e.preventDefault();
  const val = (id) => $("#f_" + id)?.value || "";
  let r = { id: record?.id || uid() };
  if (type === "company")
    Object.assign(r, {
      name: val("name"),
      headline: val("headline"),
      intro: val("intro"),
      aboutTitle: val("aboutTitle"),
      about: val("about"),
      years: val("years"),
      projects: val("projects"),
      active: val("active") === "true",
    });
  if (type === "services")
    Object.assign(r, {
      title: val("title"),
      description: val("description"),
      status: val("status"),
    });
  if (type === "contacts")
    Object.assign(r, {
      type: val("type"),
      value: val("value"),
      note: val("note"),
      status: val("status"),
    });
  if (type === "news")
    Object.assign(r, {
      title: val("title"),
      category: val("category"),
      date: val("date"),
      description: val("description"),
      status: val("status"),
      image: cover,
      gallery,
    });
  if (type === "company" && r.active)
    db.company.forEach((x) => (x.active = false));
  const i = db[type].findIndex((x) => x.id === r.id);
  i < 0 ? db[type].push(r) : (db[type][i] = r);
  $("#modal").classList.remove("show");
  save();
};
$("#delete").onclick = () => {
  if (record && confirm("ลบรายการนี้ใช่หรือไม่?")) {
    db[type] = db[type].filter((x) => x.id !== record.id);
    $("#modal").classList.remove("show");
    save();
  }
};
render();

/* Arena Sport – logika toko */
// Nomor WhatsApp admin (format 62...). Jika kosong, pesanan bisa disalin dan dikirim manual.
const WA_NUMBER = "";
const FREE_SHIP = 500000;
const SHOE = ["38","39","40","41","42","43","44"], CLOTH = ["S","M","L","XL","XXL"], SOCK = ["All size","M","L"], BALL = ["Size 4","Size 5"];

const CATS = [
  { id: "sepatu", name: "Sepatu Futsal", icon: "👟", bg: "#d8ecff" },
  { id: "bola", name: "Bola Kaki", icon: "⚽", bg: "#e6f5d8" },
  { id: "mini", name: "Mini Soccer", icon: "🥅", bg: "#fff0c9" },
  { id: "jersey", name: "Jersey", icon: "👕", bg: "#ffe0d6" },
  { id: "kaos", name: "Kaos Kaki", icon: "🧦", bg: "#eadcff" },
  { id: "alat", name: "Alat Olahraga", icon: "🎒", bg: "#dcdcdc" },
];

const P = (id, cat, name, price, rating, desc, sizes, old, badge) => ({ id, cat, name, price, rating, desc, sizes, old, badge });
const PRODUCTS = [
  P(1,"sepatu","Sepatu Futsal Striker Pro",389000,4.8,"Upper sintetis ringan, sol karet anti slip untuk lapangan indoor. Bantalan tumit empuk untuk main lama.",SHOE,459000,"Terlaris"),
  P(2,"sepatu","Sepatu Futsal Court Speed",329000,4.6,"Desain ramping untuk gerak cepat. Sol datar memberi grip kuat di lantai vinyl dan parket.",SHOE),
  P(3,"sepatu","Sepatu Futsal Junior Kids",199000,4.5,"Ukuran anak dengan tali elastis dan sol lentur, nyaman untuk latihan sekolah.",["33","34","35","36","37"],249000,"Diskon"),
  P(4,"sepatu","Sepatu Futsal Classic Leather",425000,4.7,"Bahan kulit sintetis premium, sentuhan bola lebih empuk dan awet dipakai.",SHOE,null,"Baru"),
  P(5,"bola","Bola Sepak Match Size 5",189000,4.7,"Jahitan mesin kuat, pantulan stabil, cocok untuk pertandingan lapangan rumput.",["Size 5"],null,"Baru"),
  P(6,"bola","Bola Futsal Size 4",159000,4.6,"Pantulan rendah khas futsal, lapisan tahan gesek untuk lantai indoor.",["Size 4"],189000,"Diskon"),
  P(7,"bola","Bola Latihan Set isi 5",450000,4.4,"Lima bola latihan sekaligus, hemat untuk klub dan sekolah sepak bola.",["Size 4","Size 5"]),
  P(8,"mini","Bola Mini Soccer Size 4",169000,4.5,"Ukuran pas untuk mini soccer, permukaan grip bagus di rumput sintetis.",["Size 4"]),
  P(9,"mini","Gawang Mini Soccer Lipat",525000,4.7,"Rangka besi ringan, bisa dilipat dan dibawa dengan tas. Termasuk jaring.",null,599000,"Diskon"),
  P(10,"mini","Rompi Training Set isi 10",250000,4.5,"Bahan jaring adem, tersedia warna neon agar mudah dibedakan saat latihan.",null),
  P(11,"mini","Cone Marker Set isi 20",75000,4.4,"Penanda latihan dribbling dan drill. Fleksibel, tidak mudah patah.",null),
  P(12,"jersey","Jersey Tim Home Merah",149000,4.6,"Bahan dry-fit menyerap keringat, ringan dan cepat kering.",CLOTH,null,"Terlaris"),
  P(13,"jersey","Jersey Tim Away Putih",149000,4.5,"Potongan atletik, jahitan rapi di bahu dan ketiak agar tidak mengganggu gerakan.",CLOTH),
  P(14,"jersey","Jersey Kiper Lengan Panjang",175000,4.4,"Bantalan siku ringan dan bahan lentur untuk gerakan menyelam.",CLOTH),
  P(15,"jersey","Celana Futsal Dry-Fit",99000,4.5,"Pinggang karet dengan tali, ada saku kecil di sisi.",CLOTH,125000,"Diskon"),
  P(16,"kaos","Kaos Kaki Bola Panjang",35000,4.5,"Menutup betis penuh, bahan tebal di telapak untuk bantalan.",SOCK),
  P(17,"kaos","Kaos Kaki Anti Slip Grip",59000,4.7,"Titik grip di telapak mencegah kaki bergeser di dalam sepatu.",SOCK,75000,"Baru"),
  P(18,"kaos","Kaos Kaki Set isi 3",90000,4.4,"Tiga pasang warna dasar, hemat untuk pemakaian rutin.",SOCK),
  P(19,"alat","Sarung Tangan Kiper",135000,4.6,"Telapak lateks dengan grip kuat dan penyangga jari.",["7","8","9","10"]),
  P(20,"alat","Deker Shin Guard",45000,4.5,"Ringan dan tipis, dilengkapi strap elastis agar tidak turun.",["S","M","L"]),
  P(21,"alat","Tas Sepatu & Bola",120000,4.4,"Ada kompartemen terpisah untuk sepatu kotor dan jaring bola.",null),
  P(22,"alat","Botol Minum Sport 1L",39000,4.3,"Bebas BPA, tutup anti bocor, mudah dibawa ke lapangan.",null),
  P(23,"alat","Pompa Bola + Jarum",49000,4.5,"Pompa manual dengan dua jarum cadangan.",null),
  P(24,"alat","Peluit & Kartu Wasit",55000,4.4,"Peluit nyaring dan satu set kartu kuning-merah dengan buku catatan.",null),
];

const $ = (s) => document.querySelector(s);
const rp = (n) => "Rp" + n.toLocaleString("id-ID");
const catOf = (id) => CATS.find((c) => c.id === id);
const prod = (id) => PRODUCTS.find((p) => p.id === id);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

let state = { cat: "all", q: "", sort: "default", sale: false, fav: false };
let cart = load("arena-cart2", []);
let favs = load("arena-fav", []);

/* ---------- Katalog ---------- */
function renderCats() {
  $("#cats").innerHTML = CATS.map((c) => `<button class="cat" data-cat="${c.id}"><span class="ic">${c.icon}</span><b>${c.name}</b><small>${PRODUCTS.filter((p) => p.cat === c.id).length} produk</small></button>`).join("");
  $("#chips").innerHTML = [{ id: "all", name: "Semua" }, ...CATS].map((c) => `<button class="chip ${state.cat === c.id && !state.sale && !state.fav ? "on" : ""}" data-cat="${c.id}">${c.name}</button>`).join("")
    + `<button class="chip ${state.sale ? "on" : ""}" data-sale="1">Diskon</button>`;
}

function renderProducts() {
  let list = PRODUCTS.filter((p) =>
    (state.cat === "all" || p.cat === state.cat) && (!state.sale || p.old) && (!state.fav || favs.includes(p.id)) &&
    (p.name + " " + catOf(p.cat).name).toLowerCase().includes(state.q.toLowerCase()));
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  $("#grid").innerHTML = list.map((p) => {
    const c = catOf(p.cat);
    return `<article class="card">
      <div class="thumb" style="background:${c.bg}" data-view="${p.id}">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${c.icon}</div>
      <button class="heart ${favs.includes(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Favorit">♥</button>
      <div class="info"><small>${c.name}</small><h3>${p.name}</h3><span class="rate">★ ${p.rating}</span>
      <div class="price"><b>${rp(p.price)}</b>${p.old ? `<s>${rp(p.old)}</s>` : ""}</div>
      <button class="add" data-view="${p.id}">Lihat &amp; pilih</button></div></article>`;
  }).join("");
  document.querySelectorAll(".card").forEach((c) => (c.style.position = "relative"));
  $("#empty").hidden = list.length > 0;
  $("#result").textContent = `Menampilkan ${list.length} produk`;
}

function setFilter(patch) { Object.assign(state, patch); renderCats(); renderProducts(); }

/* ---------- Modal ---------- */
function openModal(html) {
  $("#modalBox").innerHTML = `<button class="x" data-close aria-label="Tutup">✕</button>` + html;
  $("#modal").classList.add("show"); $("#modal").setAttribute("aria-hidden", "false");
}
function closeModal() { $("#modal").classList.remove("show"); $("#modal").setAttribute("aria-hidden", "true"); }

let sel = { id: 0, size: null, qty: 1 };
function viewProduct(id) {
  const p = prod(id), c = catOf(p.cat);
  sel = { id, size: p.sizes && p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };
  openModal(`<div class="detail"><div class="thumb" style="background:${c.bg}">${c.icon}</div><div class="body">
    <small>${c.name}</small><h3>${p.name}</h3><span class="rate">★ ${p.rating}</span>
    <div class="price"><b>${rp(p.price)}</b>${p.old ? `<s>${rp(p.old)}</s>` : ""}</div>
    <p class="desc">${p.desc}</p>
    ${p.sizes ? `<div><b>Ukuran</b><div class="sizes" id="sizes">${p.sizes.map((s) => `<button class="size ${sel.size === s ? "on" : ""}" data-size="${s}">${s}</button>`).join("")}</div></div>` : ""}
    <div class="qty"><button data-mq="-1" aria-label="Kurangi">−</button><span id="mq">1</span><button data-mq="1" aria-label="Tambah">+</button></div>
    <p class="err" id="err"></p>
    <button class="btn full" data-addsel>Tambah ke keranjang</button></div></div>`);
}

/* ---------- Keranjang ---------- */
const key = (it) => it.id + "|" + (it.size || "");
function saveCart() { save("arena-cart2", cart); renderCart(); }
function addToCart(id, size, qty) {
  const it = cart.find((x) => x.id === id && (x.size || "") === (size || ""));
  it ? (it.qty += qty) : cart.push({ id, size, qty });
  saveCart(); toast(prod(id).name + " masuk keranjang");
}
const subtotal = () => cart.reduce((s, it) => s + prod(it.id).price * it.qty, 0);

function renderCart() {
  const total = subtotal();
  $("#cartCount").textContent = cart.reduce((s, it) => s + it.qty, 0);
  $("#cartTotal").textContent = rp(total);
  $("#shipNote").textContent = !cart.length ? "" : total >= FREE_SHIP ? "Selamat, kamu dapat gratis ongkir." : `Belanja ${rp(FREE_SHIP - total)} lagi untuk gratis ongkir.`;
  $("#cartItems").innerHTML = cart.length ? cart.map((it) => {
    const p = prod(it.id), k = key(it);
    return `<div class="item"><div class="em">${catOf(p.cat).icon}</div><div><p>${p.name}</p><small>${it.size ? "Ukuran " + it.size + " · " : ""}${rp(p.price)}</small>
      <div class="qty"><button data-q="-1" data-k="${k}" aria-label="Kurangi">−</button><span>${it.qty}</span><button data-q="1" data-k="${k}" aria-label="Tambah">+</button></div></div>
      <button class="rm" data-q="-999" data-k="${k}">Hapus</button></div>`;
  }).join("") : `<p style="padding:24px 0;color:#5b6a62">Keranjang masih kosong. Pilih produk, lalu tekan "Tambah ke keranjang".</p>`;
}
function toggleCart(open) {
  $("#drawer").classList.toggle("open", open); $("#overlay").classList.toggle("show", open);
  $("#drawer").setAttribute("aria-hidden", String(!open));
}

/* ---------- Checkout ---------- */
function openCheckout() {
  if (!cart.length) return toast("Keranjang masih kosong");
  toggleCart(false);
  const sub = subtotal(), free = sub >= FREE_SHIP;
  openModal(`<form class="form" id="coForm" novalidate><h3>Data pemesanan</h3>
    <div class="row"><label>Nama lengkap<input id="cName" autocomplete="name"></label><label>No. WhatsApp<input id="cPhone" type="tel" autocomplete="tel" placeholder="08xxxxxxxxxx"></label></div>
    <label>Alamat lengkap<textarea id="cAddr" rows="2" autocomplete="street-address"></textarea></label>
    <div class="row"><label>Kurir<select id="cShip"><option value="15000">JNE Reguler (Rp15.000)</option><option value="12000">J&amp;T (Rp12.000)</option><option value="20000">SiCepat Kilat (Rp20.000)</option><option value="0">Ambil di toko (gratis)</option></select></label>
    <label>Pembayaran<select id="cPay"><option>Transfer bank</option><option>E-wallet (DANA/OVO/GoPay)</option><option>COD</option></select></label></div>
    <label>Catatan (opsional)<input id="cNote" placeholder="Contoh: warna cadangan jika kosong"></label>
    <div class="sum" id="sum"></div><p class="err" id="coErr"></p>
    <button class="btn full" type="submit">${WA_NUMBER ? "Kirim pesanan via WhatsApp" : "Salin pesanan"}</button></form>`);
  const upd = () => {
    const ship = free ? 0 : +$("#cShip").value;
    $("#sum").innerHTML = `<div><span>Subtotal</span><span>${rp(sub)}</span></div><div><span>Ongkir</span><span>${ship ? rp(ship) : "Gratis"}</span></div><div><b>Total</b><b>${rp(sub + ship)}</b></div>`;
  };
  $("#cShip").addEventListener("change", upd); upd();
  $("#coForm").addEventListener("submit", submitOrder);
}

function submitOrder(e) {
  e.preventDefault();
  const name = $("#cName").value.trim(), phone = $("#cPhone").value.trim(), addr = $("#cAddr").value.trim();
  if (name.length < 3) return ($("#coErr").textContent = "Isi nama lengkap.");
  if (!/^(\+?62|0)\d{8,13}$/.test(phone.replace(/[\s-]/g, ""))) return ($("#coErr").textContent = "Nomor WhatsApp belum valid. Contoh: 081234567890.");
  if (addr.length < 10) return ($("#coErr").textContent = "Isi alamat selengkapnya agar kurir mudah menemukan.");
  const sub = subtotal(), ship = sub >= FREE_SHIP ? 0 : +$("#cShip").value;
  const lines = cart.map((it, i) => `${i + 1}. ${prod(it.id).name}${it.size ? " (" + it.size + ")" : ""} x${it.qty} = ${rp(prod(it.id).price * it.qty)}`);
  const msg = `Halo Arena Sport, saya ingin memesan:\n${lines.join("\n")}\n\nSubtotal: ${rp(sub)}\nOngkir: ${ship ? rp(ship) : "Gratis"}\nTotal: ${rp(sub + ship)}\n\nNama: ${name}\nWhatsApp: ${phone}\nAlamat: ${addr}\nKurir: ${$("#cShip").selectedOptions[0].text}\nPembayaran: ${$("#cPay").value}\nCatatan: ${$("#cNote").value || "-"}`;
  if (WA_NUMBER) window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  else navigator.clipboard?.writeText(msg).then(() => toast("Pesanan disalin. Kirim ke admin toko."), () => toast("Salin manual dari kotak di bawah."));
  openModal(`<div class="form"><h3>Pesanan siap dikirim</h3><p>${WA_NUMBER ? "Lanjutkan percakapan di WhatsApp untuk konfirmasi stok dan pembayaran." : "Pesanan sudah disalin. Tempel ke WhatsApp admin toko untuk konfirmasi."}</p><textarea rows="9" readonly>${msg}</textarea><button class="btn full" data-close>Selesai</button></div>`);
  cart = []; saveCart();
}

/* ---------- Event ---------- */
document.addEventListener("click", (e) => {
  const t = (s) => e.target.closest(s);
  let b;
  if ((b = t("[data-cat]"))) { setFilter({ cat: b.dataset.cat, sale: false, fav: false }); if (b.classList.contains("cat")) $("#produk").scrollIntoView(); }
  else if ((b = t("[data-sale]"))) { setFilter({ cat: "all", sale: true, fav: false }); }
  else if ((b = t("[data-view]"))) viewProduct(+b.dataset.view);
  else if ((b = t("[data-fav]"))) { const id = +b.dataset.fav; favs = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]; save("arena-fav", favs); favUI(); renderProducts(); }
  else if ((b = t("[data-size]"))) { sel.size = b.dataset.size; document.querySelectorAll(".size").forEach((s) => s.classList.toggle("on", s === b)); $("#err").textContent = ""; }
  else if ((b = t("[data-mq]"))) { sel.qty = Math.max(1, sel.qty + +b.dataset.mq); $("#mq").textContent = sel.qty; }
  else if ((b = t("[data-addsel]"))) { const p = prod(sel.id); if (p.sizes && !sel.size) return ($("#err").textContent = "Pilih ukuran dulu."); addToCart(sel.id, sel.size, sel.qty); closeModal(); }
  else if ((b = t("[data-q]"))) { const it = cart.find((x) => key(x) === b.dataset.k); if (it) { it.qty += +b.dataset.q; if (it.qty <= 0) cart = cart.filter((x) => x !== it); saveCart(); } }
  else if (t("[data-close]") || e.target.id === "modal") closeModal();
});
$("#search").addEventListener("input", (e) => setFilter({ q: e.target.value }));
$("#sort").addEventListener("change", (e) => setFilter({ sort: e.target.value }));
$("#openCart").addEventListener("click", () => toggleCart(true));
$("#closeCart").addEventListener("click", () => toggleCart(false));
$("#overlay").addEventListener("click", () => toggleCart(false));
$("#clearCart").addEventListener("click", () => { cart = []; saveCart(); });
$("#checkout").addEventListener("click", openCheckout);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { toggleCart(false); closeModal(); } });

function favUI() { $("#favCount").textContent = favs.length; $("#favBtn").classList.toggle("on", state.fav); }
$("#favBtn").addEventListener("click", () => {
  if (!favs.length && !state.fav) return toast("Belum ada favorit. Tekan ikon ♥ pada produk.");
  setFilter({ fav: !state.fav, cat: "all", sale: false }); favUI(); $("#produk").scrollIntoView();
});

$("#burger").addEventListener("click", () => $("#menu").classList.toggle("open"));
$("#menu").addEventListener("click", () => $("#menu").classList.remove("open"));

$("#newsForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("#email").value.trim(), ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  $("#newsMsg").textContent = ok ? "Terima kasih! Info diskon akan dikirim ke " + v : "Alamat email belum valid. Contoh: nama@email.com";
  if (ok) e.target.reset();
});

$("#teamForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const n = $("#tName").value.trim(), q = +$("#tQty").value;
  if (!n) return toast("Isi nama tim dulu");
  if (q < 10) return toast("Minimal pemesanan 10 jersey");
  const msg = `Halo Arena Sport, saya ingin pesan jersey tim.\nTim: ${n}\nJumlah: ${q} pcs\nWarna: ${$("#tColor").value}\nCatatan: ${$("#tNote").value || "-"}`;
  if (WA_NUMBER) window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  else openModal(`<div class="form"><h3>Permintaan jersey tim</h3><p>Salin teks ini dan kirim ke admin toko.</p><textarea rows="6" readonly>${msg}</textarea><button class="btn full" data-close>Selesai</button></div>`);
});

/* ---------- Hitung mundur flash sale (reset tiap tengah malam) ---------- */
function tick() {
  const now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
  const d = Math.floor((end - now) / 1000), pad = (n) => String(n).padStart(2, "0");
  $("#h").textContent = pad(Math.floor(d / 3600)); $("#m").textContent = pad(Math.floor((d % 3600) / 60)); $("#s").textContent = pad(d % 60);
}
setInterval(tick, 1000); tick();

/* ---------- Toast & tombol ke atas ---------- */
let tt;
function toast(text) { const t = $("#toast"); t.textContent = text; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2400); }
addEventListener("scroll", () => ($("#toTop").hidden = scrollY < 600));
$("#toTop").addEventListener("click", () => scrollTo({ top: 0 }));

renderCats(); renderProducts(); renderCart(); favUI();

// Contract address printed by "truffle migrate" (Ganache --deterministic gives the same one each fresh start)
const CONTRACT_ADDRESS = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab".toLowerCase();

const ABI = [
  "function registerContent(bytes32 fingerprint, string title)",
  "function getContent(bytes32 fingerprint) view returns (address creator, string title, uint256 registeredAt)",
  "function isRegistered(bytes32 fingerprint) view returns (bool)",
  "function transferOwnership(bytes32 fingerprint, address newOwner)",
  "function totalRegistered() view returns (uint256)"
];

let provider, signer, contract;
let currentFingerprint = null;

const $ = (id) => document.getElementById(id);

function showMessage(text) {
  $("message").textContent = text;
}

function needConnection() {
  if (!contract) {
    showMessage("Please click 'Connect to Ganache' first.");
    return true;
  }
  return false;
}

function needFingerprint() {
  if (!currentFingerprint) {
    showMessage("Please pick a file first.");
    return true;
  }
  return false;
}

function errorText(e) {
  return e.reason || (e.error && e.error.message) || e.message || String(e);
}

async function refreshTotal() {
  const total = await contract.totalRegistered();
  $("total").textContent = total.toString();
}

// ---------- Connect to the local Ganache blockchain ----------
$("connectBtn").addEventListener("click", async () => {
  try {
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    signer = provider.getSigner(0);
    const account = await signer.getAddress();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    $("status").textContent = "Connected as " + account;
    await refreshTotal();
    showMessage("Connected to Ganache.");
  } catch (e) {
    contract = null;
    $("status").textContent = "Not connected";
    showMessage("Could not connect. Is Ganache running? " + errorText(e));
  }
});

// ---------- Turn the chosen file into a SHA-256 fingerprint ----------
$("fileInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  currentFingerprint = "0x" + hex;
  $("fingerprint").textContent = currentFingerprint;
  showMessage("Fingerprint created for " + file.name);
});

// ---------- Register ----------
$("registerBtn").addEventListener("click", async () => {
  if (needConnection() || needFingerprint()) return;
  const title = $("titleInput").value.trim();
  if (!title) {
    showMessage("Please type a title first.");
    return;
  }
  try {
    showMessage("Sending transaction...");
    const tx = await contract.registerContent(currentFingerprint, title);
    await tx.wait();
    await refreshTotal();
    showMessage("Registered! Transaction: " + tx.hash);
  } catch (e) {
    showMessage("Registration failed: " + errorText(e));
  }
});

// ---------- Check ----------
$("checkBtn").addEventListener("click", async () => {
  if (needConnection() || needFingerprint()) return;
  try {
    const registered = await contract.isRegistered(currentFingerprint);
    if (!registered) {
      $("checkResult").textContent = "Not registered yet.";
      return;
    }
    const info = await contract.getContent(currentFingerprint);
    const date = new Date(info.registeredAt.toNumber() * 1000).toLocaleString();
    $("checkResult").textContent =
      "Registered! Title: " + info.title + " | Owner: " + info.creator + " | Time: " + date;
  } catch (e) {
    $("checkResult").textContent = "Check failed: " + errorText(e);
  }
});

// ---------- Transfer ownership ----------
$("transferBtn").addEventListener("click", async () => {
  if (needConnection() || needFingerprint()) return;
  const newOwner = $("newOwnerInput").value.trim();
  if (!newOwner) {
    showMessage("Please paste the new owner's address.");
    return;
  }
  try {
    showMessage("Sending transaction...");
    const tx = await contract.transferOwnership(currentFingerprint, newOwner);
    await tx.wait();
    showMessage("Ownership transferred! Transaction: " + tx.hash);
  } catch (e) {
    showMessage("Transfer failed: " + errorText(e));
  }
});
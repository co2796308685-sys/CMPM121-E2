export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
const totalCrew = 6;
let assignedToSupplies = 2;

type ShiftResults = {
  production: number;
  consumption: number;
  balance: number;
};

function calculateShiftResults(assignedCrew: number): ShiftResults {
  const production = calculateProduction(assignedCrew);
  const consumption = totalCrew;
  const balance = production - consumption;

  return {
    production,
    consumption,
    balance,
  };
}

function calculateProduction(assignedCrew: number) {
  return assignedCrew * 3;
}

function drawCrewAssignment() {
  for (let i = 0; i < totalCrew; i++) {
    ctx.fillStyle = i < assignedToSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < assignedToSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function updateAllocation() {
  const shiftResults = calculateShiftResults(assignedToSupplies);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewAssignment();
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedToSupplies} / ${totalCrew}`, 18, 76);
  ctx.fillText(`Production: ${shiftResults.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, shiftResults.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${shiftResults.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, shiftResults.consumption * 14, 20);
  readout.textContent =
    `Assigned: ${assignedToSupplies}/${totalCrew} · Production: ${shiftResults.production} · Consumption: ${shiftResults.consumption} · Balance: ${
      shiftResults.balance > 0 ? "+" : ""
    }${shiftResults.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedToSupplies = Math.max(0, assignedToSupplies - 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedToSupplies = Math.min(totalCrew, assignedToSupplies + 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedToSupplies = 2;
    updateAllocation();
  };
updateAllocation();

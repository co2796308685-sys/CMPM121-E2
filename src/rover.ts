export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let direction = 0;

type Command = {
  label: string;
  execute(): void;
};

const forwardCommand: Command = {
  label: "Forward",
  execute() {
    const currentDirection = directions[direction];

    x = Math.max(0, Math.min(4, x + currentDirection.dx));
    y = Math.max(0, Math.min(4, y + currentDirection.dy));

    drawRover();
  },
};

const rightCommand: Command = {
  label: "Right",
  execute() {
    direction = (direction + 1) % directions.length;
    drawRover();
  },
};

const commandQueue: Command[] = [];

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

function runCommand(command: Command) {
  command.execute();
}

function renderPendingCommands() {
  pendingList.replaceChildren();

  for (const command of commandQueue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    pendingList.append(item);
  }

  queueStatus.textContent = commandQueue.length === 0
    ? "Empty"
    : `${commandQueue.length} pending`;
}

function enqueueCommand(command: Command) {
  commandQueue.push(command);
  renderPendingCommands();
}

function runQueuedCommands() {
  for (const command of commandQueue) {
    runCommand(command);
  }

  commandQueue.length = 0;
  renderPendingCommands();
}

function clearQueuedCommands() {
  commandQueue.length = 0;
  renderPendingCommands();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand(forwardCommand);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand(rightCommand);
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  clearQueuedCommands();
  drawRover();
};

runButton.onclick = () => {
  runQueuedCommands();
};

clearButton.onclick = () => {
  clearQueuedCommands();
};

runButton.disabled = false;
clearButton.disabled = false;

renderPendingCommands();
drawRover();

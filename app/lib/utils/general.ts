export function calculateVotePercentage(x?: number, y?: number) {
  if (x !== undefined && y !== undefined) {
    return (x / (x + y)) * 100;
  }
  return 0;
}

export function getRandomInt(endRange: number) {
  const min = Math.ceil(1);
  const max = Math.floor(endRange);
  const t = Math.floor(Math.random() * (max - min + 1)) + min;
  return t;
}

export function getRandomIds(endRange: number) {
  let x = getRandomInt(endRange);
  let y = getRandomInt(endRange);

  while (x == y) {
    x = getRandomInt(endRange);
    y = getRandomInt(endRange);
  }
  return { x: x.toString(), y: y.toString() };
}

export function getBattleStatus(itemOneVotes: number, itemTwoVotes: number) {
  if (itemOneVotes === itemTwoVotes) {
    return "Tied";
  }
  return itemOneVotes > itemTwoVotes ? "Winner" : "Loser";
}

const https = require("https");
const url = "https://www.rolandgarros.com/api/en-us/polling";

https
  .get(url, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      try {
        let json = JSON.parse(body);
        printMatches(json.matches);
        // do something with JSON
      } catch (error) {
        console.error(error.message);
      }
    });
  })
  .on("error", (error) => {
    console.error(error.message);
  });

function printMatches(matches) {
  for (const match of matches) {
    const { teamA, teamB, matchData } = match;
    console.log("@ " + matchData.courtName);
    let nameLength = 0;
    const printout = [];
    //  PlayerA, PlayerB
    for (const team of [teamA, teamB]) {
      if (team.players.length > 1) {
        console.log("Doubles Game, SKIP");
        break;
      }
      const name = team.players[0].shortName;
      if (nameLength < name.length) {
        nameLength = name.length;
      }
      const scores = team.sets
        .map(({ score, inProgress }) => `${score}${inProgress && team.hasService ? "*" : " "}`)
        .join(" ");
      printout.push([name, scores]);
    }
    let lineLength = nameLength;
    for (const [name, scores] of printout) {
      console.log(name.padEnd(nameLength, " ") + " " + scores);
      lineLength = nameLength + 1 + scores.length;
    }
    console.log(Array(lineLength).fill("-").join(""));
  }
}

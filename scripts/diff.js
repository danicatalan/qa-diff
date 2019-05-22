const BlinkDiff = require('blink-diff');
const exec = require("child_process").exec;

exec("cd input && ls *.png", (error, stdout, stderr) => {
  let items = stdout
    .split("\n")
    .filter(item => item.includes(".png"))
    .map(item => item.replace(".png", ""));

  let pairs = [];

  items.forEach(i => {
    items.forEach(j => {
      let pair = [i, j].sort();
      pairs.push(pair);
    })
  });

  pairs = pairs.sort().filter((item, index) => {
    const current = item.toString();
    const prev = pairs[index - 1] === undefined ? "" : pairs[index - 1].toString();
    return current === prev;
  })

  pairs.forEach(pair => {
    const imageA = pair[0];
    const imageB = pair[1];

    var diff = new BlinkDiff({
      imageAPath: `input/${imageA}.png`,
      imageBPath: `input/${imageB}.png`,

      thresholdType: BlinkDiff.THRESHOLD_PERCENT,
      threshold: 0.01, // 1% threshold

      imageOutputPath: `output/${imageA}-${imageB}.png`
    });

    diff.run(function (error, result) {
      if (error) {
        throw error;
      } else {
        //console.log(diff.hasPassed(result.code) ? 'Passed' : 'Failed');
        console.log(`${imageA}-${imageB}: Found ${result.differences} differences.`);
      }
    });
  })
});
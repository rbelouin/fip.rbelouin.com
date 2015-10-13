var casper = require("casper").create({
  waitTimeout: 60000
});

casper.start(casper.cli.args[0]);

casper.waitFor(function() {
  return this.evaluate(function() {
    var lines = document.querySelector("#__testling_output").textContent.split("\n");
    return lines.find(function(line) {
      return line.indexOf("# ok") === 0 || line.indexOf("# fail") === 0;
    });
  });
});

casper.run();

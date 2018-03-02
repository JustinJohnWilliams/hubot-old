// Description:
//   Generates help commands for Hubot.
//
// Commands:
//   hubot help - Displays all of the help commands that Hubot knows about.
//   hubot help <query> - Displays all help commands that match <query>.
//
// URLS:
//   /hubot/help
//
// Notes:
//   These commands are grabbed from comment blocks at the top of each file.
module.exports = function(robot) {
	robot.respond(/help\s*(.*)?$/i, (msg) => {
		let cmds = robot.helpCommands();
		if (msg.match[1]) {
			cmds = cmds.filter((cmd) => {
				return cmd.match(new RegExp(msg.match[1], "i"));
			});
			if (cmds.length === 0) {
				msg.send(`No available commands match ${msg.match[1]}`);
				return;
			}
		}
		let emit = cmds.join("\n");
		if (robot.name.toLowerCase() !== "hubot") {
			emit = emit.replace(/hubot/ig, robot.name);
		}
		msg.send(emit);
	});
	robot.router.get(`/${robot.name}/help`, (req, res) => {
		const cmds = robot.helpCommands().map((cmd) => {
			return cmd.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		});
		const emit = `<p>${cmds.join("</p><p>")}</p>`
			.replace(/hubot/ig, `<b>${robot.name}</b>`);
		res.setHeader("content-type", "text/html");
		res.end(helpContents(robot.name, emit));
	});
};


function helpContents(name, commands) {
	return `<html>
		   <head>
		      <title>${name} Help</title>
		      <style type="text/css">
			 body {
				 background: #d3d6d9;
				 color: #636c75;
				 text-shadow: 0 1px 1px rgba(255, 255, 255, .5);
				 font-family: Helvetica, Arial, sans-serif;
			 }
			 h1 {
				 margin: 8px 0;
				 padding: 0;
			 }
			 .commands {
				 font-size: 13px;
			 }
			 p {
				 border-bottom: 1px solid #eee;
				 margin: 6px 0 0 0;
				 padding-bottom: 5px;
			 }
			 p:last-child {
				 border: 0;
			 }
		      </style>
		   </head>
		   <body>
		      <h1>${name} Help</h1>
		      <div class="commands">
			 ${commands}
		      </div>
		   </body>
		</html>`;
}
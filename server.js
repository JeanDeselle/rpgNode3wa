import http from "http";
import pug from "pug";
import fs from "fs";

const hostname = "localhost";
const port = "8081";
const characters = JSON.parse(fs.readFileSync("./characters.json")).characters;
// loan et jean
function getTemplate(value , res) {
    try {
        res.writeHead(200, {
            "Content-Type": "text/html",
        });
        const renderTemplate = pug.compileFile("template.pug");
        const result = renderTemplate(value);
        res.write(result);
        res.end();
    } catch (err) {
        console.log("Erreur lors de la compilation :\n");
        console.log(err.message);
    }
}

const server = http.createServer((req, res) => {
	const url = req.url.replace("/", "");
    
	if (url === "favicon.ico") {
		res.writeHead(200, { "Content-Type": "image/x-icon" });
		res.end();
		return;
	} else if (url === "") {
        // loan et jean
		getTemplate({list : true , classList : characters} , res);
	} else if (url === "app.js") {
        // jean
		res.writeHead(200, { "Content-Type": "text/javascript" });
		const js = fs.readFileSync("./asset/javascript/app.js");
		res.write(js);
		return res.end();
	} else if (url === "addClass"){
        // loan et jean
        getTemplate({formulaire : true }, res);
    }else if (url === "style.css"){
        // loan et jean
        res.writeHead(200, { "Content-Type": "text/css" });
		const css = fs.readFileSync("./asset/css/style.css");
		res.write(css);
        return res.end();
    }else if (url === "bg.jpg"){
        // loan
        res.writeHead(200, { "Content-Type": "image/jpeg" });
		const img = fs.readFileSync("./asset/img/bg.jpg");
		res.write(img);
        return res.end();
    } else if (url === "shyguy.png"){
        // loan
        res.writeHead(200, { "Content-Type": "image/png" });
		const img = fs.readFileSync("./asset/img/shyguy.png");
		res.write(img);
        return res.end();
    }else if (url === "rpg"){
        getTemplate({rpg : true } , res);
    }else if(url === "game.js"){
        res.writeHead(200, { "Content-Type": "text/javascript" });
		const js = fs.readFileSync("./asset/javascript/game.js");
		res.write(js);
		return res.end();
    }else if(req.method === "GET"){
        res.writeHead(200, {"content-type": "application/json"})
        res.write({test : "test"});
        res.end();
    }

	if (req.method === "POST") {
        // jean
		let body = "";
		req.on("data", (data) => (body += data));

		req.on("end", () => {
			body = JSON.parse(body);
           if( checkValue(body)){
               characters.push(body);
               console.log(characters);
               fs.writeFile("./characters.json", JSON.stringify({"characters": characters}), (err) => {
                   if (err) throw err;
               });
           }
			res.end();
		});
	}
});
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

function checkValue(obj) {
    // jean
    console.log("check");
	let checked = true;
    for (const prop in obj) {
        if(prop === "name"){
            if(obj[prop] === ""){
                checked = false;
            }
        }
    }

    console.log(checked);
    return checked;
}


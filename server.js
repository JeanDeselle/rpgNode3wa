import http from "http";
import pug from "pug";
import fs from "fs";

const hostname = "localhost";
const port = "8081";
const characters = JSON.parse(fs.readFileSync("./characters.json")).characters;

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
		getTemplate({formulaire : false , classList : characters} , res);
	} else if (url === "app.js") {
		res.writeHead(200, { "Content-Type": "text/javascript" });
		const js = fs.readFileSync("./asset/javascript/app.js");
		res.write(js);
		return res.end();
	} else if (url === "addClass"){
        getTemplate({formulaire : true }, res);
    }else if (url === "style.css"){
        res.writeHead(200, { "Content-Type": "text/css" });
		const css = fs.readFileSync("./asset/css/style.css");
		res.write(css);
        return res.end();
    }else if (url === "bg.jpg"){
        res.writeHead(200, { "Content-Type": "image/jpeg" });
		const img = fs.readFileSync("./asset/img/bg.jpg");
		res.write(img);
        return res.end();
    } else if (url === "shyguy.png"){
        res.writeHead(200, { "Content-Type": "image/png" });
		const img = fs.readFileSync("./asset/img/shyguy.png");
		res.write(img);
        return res.end();
    }

	if (req.method === "POST") {
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


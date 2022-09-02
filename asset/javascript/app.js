const inputs = document.querySelectorAll(".inputsStat");
const btnAdd = document.querySelector("#buttonAdd");
const inputName = document.querySelector("#nameClass");


function shyGuyTalk() {
    const vignette = document.querySelector(".vignette");
	const random = Math.floor(Math.random() * 10) + 1;
	const message = {
		1 : "P'tit con",
		2 : "Hé moi j'm'en bas les cacachouètes",
		3 : "LAISSEZ MOI DES MESSAGES",
		4 : "VIENS A CLIGNANCOURT",
		5 : "J'suis chaud bouillant",
		6 : "J'représente taïtaï",
		7 : "C'est la patate mon frère, t'inquiète pas",
		8 : "Je les fais profiter les petit derrière moi",
		9 : "Regarde moi cette qualité de travail..en dain !",
		10 : "MAIS POUSSEZ VOUS ! ON EST EN GUETS-APENS LA !"	}
        vignette.innerHTML = message[random];
}

function createClass(data) {
	// console.log(data);
	const classDesc = {
		name: data.name,
		health: {
			min: data.minHp,
			max: data.maxHp,
		},
		armor: {
			min: data.minArmor,
			max: data.maxArmor,
		},
		magic: {
			min: data.minMagic,
			max: data.maxMagic,
		},
		strength: {
			min: data.minStrenght,
			max: data.maxStrenght,
		},
		speed: {
			min: data.minSpeed,
			max: data.maxSpeed,
		},
	};

	fetch("http://localhost:8081", {
		method: "POST",
		body: JSON.stringify(classDesc),
	});
}

if (btnAdd) {
    const elements = {};
	btnAdd.addEventListener("click", function (e) {
		elements["name"] = inputName.value;
		for (let i = 0; i < inputs.length; i++) {
			const element = inputs[i];
			elements[inputs[i].id.toString()] = parseInt(inputs[i].value);
		}
		createClass(elements);
	});

    // inputs.map(input => {
    //     input.addEventListener("input", function (e) {
    //         console.log(e);
    //     });
    // })
    for (let i = 0; i < inputs.length; i++) {
        const element = inputs[i];
        element.addEventListener("input",(e) => {
            console.log(e);
        })
    }
}

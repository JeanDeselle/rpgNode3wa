const container = document.getElementById("ctnGame");
// todo pas fini
const init = () => {
	let html = `
        <div>
            <label for="">What difficulty do you want ?</label>
            <input type="radio" class="radioDifficulty" name="difficulty" id=""><span>easy</span>
            <input type="radio" class="radioDifficulty" name="difficulty" id="" checked><span>medium</span>
            <input type="radio" class="radioDifficulty" name="difficulty" id=""><span>hard</span>
        </div>
        <div>
            <label for="">How many allies do you want for your quest ?</label>
            <input type="number" name="numerOfAllies" id="numerOfAllies" min="0" max="2">
            <input type="submit" name="button" id="valider1" value="valider">
        </div>
    `;
	container.innerHTML = html;
};
init();

const game = {
	numberOfAllies: 0,
	difficulty: null,
};

let { numberOfAllies, difficulty } = game;

const valider1 = document.getElementById("valider1");
valider1.addEventListener("click", (e) => {
	const inputNumberOfAllies = document.getElementById("numerOfAllies");
	const btnRadio = document.querySelectorAll(".radioDifficulty");
	e.preventDefault();
	console.log("test");
	numberOfAllies = parseInt(inputNumberOfAllies.value);
	for (let i = 0; i < btnRadio.length; i++) {
		const element = btnRadio[i];
		if (element.checked) {
			difficulty = element.value;
		}
	}
	console.log(game);
    allieInformations()
});

const allieInformations = () => {
    let lHtml ;
	switch (numberOfAllies) {
		case 0:
			break;
		case 1:
			lHtml = `
                <form action="">
                    <div>
                        <label for="">What difficulty do you want ?</label>
                        <input type="text" name="ally name" id="" placeholder="Choose the name of your ally">
                    </div>
                    <div>
                        <select name="class" id="">
                            <option value="">Please choose a class for your ally</option>
                    </div>
                </form>
                `;
			container.innerHTML = lHtml;
            break;
            case 2:
                lHtml = `
                <form action="">
                    <div>
                        <label for="">What difficulty do you want ?</label>
                        <input type="text" name="ally name" id="" placeholder="Choose the name of your ally">
                    </div>
                    <div>
                        <select name="class" id="">
                            <option value="">Please choose a class for your ally</option>
                    </div>
                </form>
                `;
			container.innerHTML = lHtml;
            break;
	}
	lHtml = `
    <form action="">
        <div>
            <label for="">What difficulty do you want ?</label>
            <input type="radio" name="difficulty" id=""><span>easy</span>
            <input type="radio" name="difficulty" id="" checked><span>medium</span>
            <input type="radio" name="difficulty" id=""><span>hard</span>
        </div>
        <div>
            <label for="">How many allies do you want for your quest ?</label>
            <input type="number" name="numerOfAllies" id="numerOfAllies" min="0" max="2">
            <input type="submit" name="button" id="valider1" value="valider">
        </div>
    </form>
    `;
	fetch("http://localhost:8081").then((data) => {
		classlist = data.json();
        console.log(classlist);
	});

	container.innerHTML = lHtml;
};

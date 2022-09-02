import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";

// get characters data
const characters = JSON.parse(fs.readFileSync("./characters.json")).characters;
let charactersName ;
// create character stats
const setCharacter = (character) => {
  const stats = {};

  for (const { name, health, armor, magic, strength, speed } of characters) {
    if (name === character.toLowerCase()) {
      stats.name = name;
      stats.armor = Math.floor(Math.random() * (armor.max - armor.min + 1)) + armor.min;
      stats.health = Math.floor(Math.random() * (health.max - health.min + 1)) + health.min;
      stats.magic = Math.floor(Math.random() * (magic.max - magic.min + 1)) + magic.min;
      stats.strength = Math.floor(Math.random() * (strength.max - strength.min + 1)) + strength.min;
      stats.speed = Math.floor(Math.random() * (speed.max - speed.min + 1)) + speed.min;
    }
  }

  // return character stats
  return stats;
};

//jean et loan
const attack = {
  1 : 'Physical attack',
  2 : 'Magic attack',
  3 : 'Armor boost',
  4 : 'Strenght boost',
  5 : 'Magic boost',
  6 : 'Speed boost',
  7 : 'Healing boost',
}


// create hydra
let hydra = setCharacter("hydra");
let player = null;
let player2 = null;
let player3 = null;
let isActive = true;

let turn = 1;

// act function
const action = (action, attacker, target, choose) => {
  const dice = Math.floor(Math.random() * 6) * 2;
  let damage = null;

  if (choose) {
    switch (action) {
      case "Physical attack":
        damage = attacker.strength + dice - target.armor;
        target.health -= damage;
        console.log(chalk.blue(`${attacker.pseudo} inflicted ${damage} physical damages`));
        break;
      case "Magic attack":
        damage = attacker.magic + dice - target.armor;
        target.health -= damage;
        console.log(chalk.blue(`${attacker.pseudo} inflicted ${damage} magic damages`));
        break;
      case "Armor boost":
        attacker.armor += dice / 2;
        console.log(chalk.blue(`${attacker.pseudo} gain ${dice / 2} armor points`));
        break;
      case "Strenght boost":
        attacker.strength += dice / 2;
        console.log(chalk.blue(`${attacker.pseudo} gain ${dice / 2} strenght points`));
        break;
      case "Magic boost":
        attacker.magic += dice / 2;
        console.log(chalk.blue(`${attacker.pseudo} gain ${dice / 2} magic points`));
        break;
      case "Speed boost":
        attacker.speed += dice / 2;
        console.log(chalk.blue(`${attacker.pseudo} gain ${dice / 2} speed points`));
        break;
      case "Healing spell":
        attacker.health += dice * 2;
        console.log(chalk.blue(`${attacker.pseudo} recovers ${dice * 2} health points`));
        break;
      default:
        break;
    }
  } else {
    if (dice > 6) {
      damage = attacker.strength + dice - target.armor;
      target.health -= damage;
      console.log(chalk.red(`${attacker.name} inflicted ${damage} physical damages`));
    } else {
      damage = attacker.magic + dice - target.armor;
      target.health -= damage;
      console.log(chalk.red(`${attacker.name} inflicted ${damage} magic damages`));
    }
  }
  
};

// endGame function Loan
const endGame = (winnerName, looserName, winnerSecondName, winnerHP, allie1, allie2 ) => {
  if (turn === 1) {
    console.log("\n");
    console.log(chalk.yellow(`GG, close one ^^, ${winnerSecondName} still had ${winnerHP} HP, bummer`));
    console.log("\n");
  } else if(turn === 1 && winnerName === "hydra") {
    console.log("\n");
    console.log(chalk.yellow(`Damn you got WASHED, ${winnerSecondName} still had ${winnerHP} HP, not gonna lie, you're pretty bad`));
    console.log("\n");
  } else if (winnerName === "hydra"){
    console.log("\n");
    console.log(chalk.yellow(`${winnerName} defeat ${looserName}, ${winnerSecondName} win at turn ${turn}`));
    console.log("\n");
  } else {
    console.log("\n");
    console.log(chalk.yellow(`${winnerName}${!!allie1 ? ", " + allie1 : "" }${!!allie2 ? ", " + allie2 : "" } defeat ${looserName}, ${winnerSecondName} win ${winnerHP > 0 ? `with ${winnerHP}` : `you are dead but your allies win`}  HP at turn ${turn}`));
    console.log("\n");
  }

  console.log("endgame")
  turn = 1;
  hydra = setCharacter("hydra");
  isActive = false;
};

// recursion function
const prompt = (type, message, choices, number) => {
  inquirer
    .prompt([
      {
        type: type,
        name: "answer",
        message,
        choices,
      },
    ])
    .then((res) => {
      switch (number) {
        case 1:
          if (res.answer === "Easy") hydra.headNumber = 1;
          else if (res.answer === "Medium") hydra.headNumber = 2;
          else hydra.headNumber = 3;

          return prompt("list","How many allies do you want for your quest ?", ["0", "1", "2"], 6);
        case 2:
          // create player
          player = setCharacter(res.answer);
          return prompt("input", "What's your name?", [], 3);
        case 3:
          if (res.answer === "") {
            return prompt("input", "What's your name, seriously?", [], 3);
          }

          player.pseudo = res.answer;
          break;
          // loan et jean
        case 4:
          let players = [];
          players.push(player);
          players.push(hydra);
          if(!!player2){
            players.push(player2);
          }
          if(!!player3){
            players.push(player3);
          }
          players = players.sort(function(a, b) {
            if (a.speed < b.speed) {
              return 1;
            }
            if (a.speed > b.speed) {
              return -1;
            }
            return 0;
          })
          
          players.forEach(play => {
              if(play.name !== "hydra"){
                // is player alive
                if(play === player && play.health > 0){
                  // player attack
                  action(res.answer, play, hydra, true);
                }else if(play.health > 0){
                  // allies attack
                  action(attack[Math.floor(Math.random() * 6) + 1] , play, hydra, true);
                }
              }else{
                // todo il attaque que les vivant et le random et le passif
                // hydra attack
                for (let i = 0; i < hydra.headNumber; i++) action(attack[Math.floor(Math.random() * 6) + 1], hydra, getRandomTarget(players), false);
                // is hydra alive
                if (hydra.health <= 0) return endGame(player.pseudo, "Hydra", "you", player.health, !!player2 ? player2.pseudo : undefined, !!player3 ? player3.pseudo : undefined);
              }
              // is player's team alive
              if (player.health <= 0 && (player2.health <= 0 && !!player2) && (player3.health <= 0 && !!player3)) return endGame("Hydra", play.pseudo, "Hydra", hydra.health);
     
          });
          // loan
          if(!isActive){
            return prompt("list", "Play an other game?", ["Yes", "No"], 5);
          }
          turn++;
          break;
        case 5:
          console.log("case 5");
          // restart game
          if (res.answer === "Yes") return prompt("list", "What difficulty do you want", ["Easy", "Medium", "Hard"], 1);
          
          // exit game
          return process.exit(0);

        case 6: //loan et jean
          if (res.answer === "0") {
            console.log("Nice guts, i like that");
            return prompt("list", "Wich class do you want to play ?", /* ["Magician", "Paladin", "Barbarian"] */ charactersName , 2);
          }
          else if(res.answer === "1"){
            return prompt("list", "Which class do you want for your ally ?", /* ["Magician", "Paladin", "Barbarian"] */ charactersName , 7);
          }else if(res.answer === "2"){
            return prompt("list", "Which class do you want for your first allies ?", /* ["Magician", "Paladin", "Barbarian"] */ charactersName , 8);
          }
          
        case 7: //loan
          player2 = setCharacter(res.answer);
          if(!player3){
            return prompt("input", "What's the name of your ally ?", [], 9);
          }else{
            return prompt("input", "What's the name of your first ally ?", [], 10);
          }

        case 8: // loan
          player3 = setCharacter(res.answer);
          return prompt("list", "Which class do you want for your last ally ?", /* ["Magician", "Paladin", "Barbarian"] */ charactersName, 7);

        case 9: //loan
          if(res.answer !== ""){
            player2.pseudo = res.answer;
          }else{
            return prompt("input", "What's your name, seriously?", [], 9);
          }
          return prompt("list", "Wich class do you want to play ?", /* ["Magician", "Paladin", "Barbarian"] */ charactersName , 2);
          
        case 10: //jean 
        if(res.answer !== ""){
          player3.pseudo = res.answer;
        }else{
          return prompt("input", "What's the name of your first ally, seriously?", [], 10);
        }
          return prompt("input", "What's the name of your last ally ?", [], 9);
          default:
            break;
          
      }


      // send data
      console.log("\n");
      console.log(chalk.cyan(`Turn ${turn}`));
      console.table([player, !!player2 ? player2 : null , !!player3 ? player3 : null  , hydra]);
      console.log("\n");

      // call recursion
        prompt("list", "What attack do you want to make?", ["Physical attack", "Magic attack", "Armor boost", "Strenght boost", "Magic boost", "Speed boost", "Healing spell"], 4);
      });
};

const getCharactersName = () => {
  const arr = [];
  characters.map(char => {
    if(char.name !== "hydra"){
      arr.push(char.name);
    }
  })
  return arr;
}

const getRandomTarget = (players = []) => {
  const random = Math.floor(Math.random() * (players.length -1  + 1))
    const target = players[random];
    if(target.health <= 0){
      getRandomTarget();
    }
    return target
}

// start process
figlet("UN JOUR ON SAURA CODER", (err, data) => {
  if (err) return console.log(err);
  isActive = true
  // clear terminal
  const lines = process.stdout.getWindowSize()[1];
  for (let i = 0; i < lines; i++) console.log("\r\n");

  console.log(data);
  console.log("\n");
  charactersName = getCharactersName();
  // call recursion
  prompt("list", "What difficulty do you want", ["Easy", "Medium", "Hard"], 1);
});

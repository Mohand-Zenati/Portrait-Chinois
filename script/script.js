

// Création des différents variables
var buttonD = document.querySelector(".btn_droite");
var buttonG = document.querySelector(".btn_gauche");
var formulaireVisible = false; // Affiche ou non du formulaire
var mentionVisible = false; // Affichage ou non des mentions légales
var index = 0 //index du tableau contenant les différents portraits chinois
let palettes = {}; // CREATION DE PALETTE DE COULEUR pour le fond
palettes['rose'] = ["#c55fcd", "#cc79d7", "#d292e0", "#daa9e8", "#e2c0ef"];
palettes['bleu'] = ["#00bdff", "#6ec2ff", "#9bc7ff", "#bccdff", "#d5d5ff"];
palettes['bleu1'] = ["#00c6ff", "#00b0ff", "#0098ff", "#007cff", "#3f5af2"];
palettes['gris'] = [ "#818581", "#62625e", "#43413f", "#242323", "#000000"];
palettes['orange'] = ["#ffbf99", "#f29c71", "#e4774d", "#d54f2d", "#c41111"];
palettes['rouge'] = ["#ffdd94", "#fdbe64", "#fd9b39", "#fe7114", "#ff3300"];
palettes['vert'] = ["#86e6b5", "#66d9bb", "#4acbbf", "#32bcc1", "#27adc0"];

// Les différents évenements : 
buttonD.addEventListener("click", () => changementContenu("droite"))
buttonG.addEventListener("click", () => changementContenu("gauche"))
document.querySelector(".volet").addEventListener('click', () => ChargementDuVolet()) // Détecter le clic sur le titre du volet déroulant
document.querySelector('.btn-a-propos').addEventListener("click", (function (e) {
    document.querySelector('.a-propos').classList.remove('a-propos-invisible');
}));
document.querySelector('.a-propos-fermer').addEventListener("click", (function (e) {
    document.querySelector('.a-propos').classList.add('a-propos-invisible');
}));
document.querySelector("#envoie").addEventListener("click", () => EnvoieDeDonnees())

// CHANGEMENT DU CONTENU
function changementContenu(direction) {
    // Désactivation du click pendant une seconde le temps que le contenu charge
    buttonD.style.pointerEvents = "none";
    setTimeout(function () {
        buttonD.style.pointerEvents = "auto";
    }, 1000);
    // Si click droite, on fait :
    if (direction == "droite") {
        // si voit le formulaire et qu'une personne click droit on affiche le 1er contenu du tableau chinois qui est à l'index 0
        if (formulaireVisible) {
            formulaireVisible = false
            document.querySelector('.portrait-chinois-formulaire').classList.add("invisible");
            document.querySelector('.portrait-chinois-contenu').classList.remove("invisible");
            index = 0
        } else {
            if (index >= analogies.length) { // Si on arrive au bout de nos différents portrait chinois, on affiche le formulaire afin d'ajouter un nouveau portrait
                formulaireVisible = true
                document.querySelector('.portrait-chinois-formulaire').classList.remove("invisible");
                document.querySelector('.portrait-chinois-contenu').classList.add("invisible");
                return
            } else {
                // Passe a prochain portrait chinois en ajouté un au tableau
                index++
            }
        }
    } else {
        if (index == 0) {
            if (!formulaireVisible) {
                formulaireVisible = true
                document.querySelector('.portrait-chinois-formulaire').classList.remove("invisible");
                document.querySelector('.portrait-chinois-contenu').classList.add("invisible");
                return
            } else {
                formulaireVisible = false
                document.querySelector('.portrait-chinois-formulaire').classList.add("invisible");
                document.querySelector('.portrait-chinois-contenu').classList.remove("invisible");
                index = analogies.length - 1
            }
        } else {
            index--;
        }
    }
    ChargementNouvelleDonnees();
}


function EnvoieDeDonnees() {
    //Personnalisation des paramètres qu'on envoie au serveur //
    var urlVisitee = "https://perso-etudiant.u-pem.fr/~gambette/portrait/api.php?format=json&login=gambette&courriel=" + document.querySelector("#courriel").value + "&message=Si j'étais ... " + document.querySelector("#analogies").value + " je serais ..." + document.querySelector("#valeurAnalogies").value;

    fetch(urlVisitee).then(function (response) {
        response.json().then(function (data) {
            console.log("Réponse reçue : ")
            console.log(data);
        })
    })

    // Ajout du nouveau portrait dans notre tableau analogies
    analogies.unshift({
        "color": "rose",
        "text-color": "white",
        "img": document.querySelector("#imageAnalogies").value,
        "titre": "Si j'étais" + document.querySelector("#analogies").value,
        "Sous-titre": "Je serais" + document.querySelector("#valeurAnalogies").value,
        "description": document.querySelector("#descriptionAnalogies").value,
    })
    // on quitte la vue formulaire, pour affiche le 1er élement du tableau qui sera mtn la nouvelle analogie ajouté
    changementContenu("droite")
}

function ChargementDuVolet() {
    if (!mentionVisible) {
        document.querySelector(".volet-invisible").animate([{
            "height": "300px"
        }], {
            "duration": 800
        })
        setTimeout(function f() {
            // Attribuer la classe volet-visible à la place de la classe volet-invisible
            document.querySelector(".volet").classList.add("volet-visible");
            document.querySelector(".volet").classList.remove("volet-invisible");
        }, 800)
        mentionVisible = true;
    } else {

        document.querySelector(".volet").classList.remove("volet-visible");
        document.querySelector(".volet").classList.add("volet-invisible");
        mentionVisible = false;
    }
}

function ChargementNouvelleDonnees() {
    let fond = document.querySelector("#portrait-chinois-bg")
    let image = document.querySelector(".portrait-chinois-image")
    let titre = document.querySelector(".portrait-titre")
    let sousTitre = document.querySelector(".portrait-soustitre")
    let description = document.querySelector(".portrait-description")

    fond.style.backgroundImage = "url(" + analogies[index].fond + ")"
    image.src = analogies[index].img
    titre.innerHTML = analogies[index].titre;
    sousTitre.innerHTML = analogies[index]["Sous-titre"];
    description.innerHTML = analogies[index].description;
    document.body.style.background = "linear-gradient(to right top," + palettes[analogies[index].color][0] + "," + palettes[analogies[index].color][1] + "," + palettes[analogies[index].color][2] + "," + palettes[analogies[index].color][3] + ")";
    document.querySelector('.soustitre-color').style.color = analogies[index]["text-color"];
    console.log("coueleur texte = ", analogies[index]["text-color"]);
    AnimerTexte('.portrait-titre');
    AnimerTexte('.portrait-soustitre');
    AnimerTexte('.portrait-description');

    document.querySelector('.portrait-chinois-image').classList.add("image-apparition");
}

function AnimerTexte(classTexte) {
    var text = document.querySelector(classTexte);
    var newDom = '';
    var animationDelay = 6;

    for (let i = 0; i < text.innerText.length; i++) {
        newDom += '<span class="lettre">' + (text.innerText[i] == ' ' ? '&nbsp;' : text.innerText[i]) + '</span>';
    }

    text.innerHTML = newDom;
    var length = text.children.length;

    for (let i = 0; i < length; i++) {
        text.children[i].style['animation-delay'] = animationDelay * i + 'ms';
    }
}

// ANIMATION DU FOND en créant des petites balles
const colors = ["#D9D7F1", "#FFFDDE", "#E7FBBE", "#FFCBCB", "white"];

const nbrBalles = 50;
const balles = [];

for (let i = 0; i < nbrBalles; i++) {
    let balle = document.createElement("div");
    balle.classList.add("balle");
    balle.style.background = colors[Math.floor(Math.random() * colors.length)];
    balle.style.left = `${Math.floor(Math.random() * 100)}vw`;
    balle.style.top = `${Math.floor(Math.random() * 100)}vh`;
    balle.style.transform = `scale(${Math.random()})`;
    balle.style.width = `${Math.random()}em`;
    balle.style.height = balle.style.width;

    balles.push(balle);
    document.body.append(balle);
}

balles.forEach((el, i, ra) => {
    let to = {
        x: Math.random() * (i % 2 === 0 ? -11 : 11),
        y: Math.random() * 12
    };

    let anim = el.animate(
        [{
                transform: "translate(0, 0)"
            },
            {
                transform: `translate(${to.x}rem, ${to.y}rem)`
            }
        ], {
            duration: (Math.random() + 1) * 2000, // random duration
            direction: "alternate",
            fill: "both",
            iterations: Infinity,
            easing: "ease-in-out"
        }
    );
});
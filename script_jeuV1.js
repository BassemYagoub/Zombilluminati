/*
    |||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||                                               |||||
    ||||| BIENVENUE SUR LE CODE DU JEU ZOMBILLUMINATI ! |||||
    |||||                                               |||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/


//propriétés de la zone delimitée pour jouer
var zonejeu = document.getElementById("zonejeu");
var width_zonejeu = 1100;
var height_zonejeu = 650;

// détection des touches | ←37 ↑38 →39 ↓40 
var keys=[];
window.onkeyup = function(e){ keys[e.keyCode] = false; }
window.onkeydown = function(e){ keys[e.keyCode] = true; }


//tableaux contenant les objets box et images de la map
var map = [];
var imagesbgd = [];
//chaque box a la même largeur et longueur
var width_box = 50;
var height_box = 50;


//propriétés de base du joueur
var x_joueur = 550;
var y_joueur = 50;
var j_width = 36; 	          // Largeur/longueur du sprite joueur
var j_height = 43;
var speed_x = 15;             // Vitesse du joueur en abscisse/ordonnée
var speed_y = 0;
var acceleration_y = 4;
var step = 1;                 //compteur de pas pour l'animation du joueur
var nb_hp = 5;
var direction_j = "right";    //la direction vers laquelle fait face le joueur (nécessaire pour le shoot)
var delai_hit = 0;
var div_hp_deja_cree = false; //bool pour savoir si besoin de recréer le div affichant les hp


//propriétés de base de la balle que le joueur peut tirer
var bullet = document.getElementById("bullet"); 
var bullet_width = 12;
var intervalId_bullet = null; //permet de ne tirer qu'une balle à la fois
var y_bullet;
var x_bullet;


//vars concernant les ennemis
var enemies = [];             //le tableau avec leur propriétés
var speed_x_enemy = 5;
var speed_y_enemy = 0;
var nb_enemies = 4;           //nombre d'ennemis incrémenté à chaque vague
var cpt_morts = 0;            //compteur pour savoir quand changer de vague
var enemy_touche_cote = "false"; //voir fonction d'IA
var step_e = 1;               //compteur de pas pour l'animation de l'ennemi
var ennemis_a_spawn = nb_enemies;


//vagues et timers
var wave = 2;                 //on prépare la future vague
var id_wave = document.getElementById("wave");
var wave_prec = 1;            //vague actuelle
var delai_spawn = 1000;       //delai entre chaque ennemi qui spawn, en ms
var time = 0;                 //timer pour le score en fin de partie
var pause = false;

/*------------------------------------------------------------------------*/


//FONCTION PRINCIPALE (Se repetant toutes les 40ms tant que le joueur est vivant)
function Boucle() {
 
if(keys[80]) //touche P
    PauseJeu();

 if(pause == false){
    CreateEnemies(); //si ennemis_a_spawn > 0, on fait apparaître des ennemis
    
	if(cpt_morts == nb_enemies){	//chgmt wave
		id_wave.innerHTML= "<b>VAGUE "+wave+"</b>";
		id_wave.style.fontSize= "4em";
		id_wave.style.transition = "all 2s";
		wave_prec++;
		if(ennemis_a_spawn <= 0 && wave_prec == wave){
			ennemis_a_spawn = nb_enemies+2;
		}
		wave++;
		nb_enemies += 2; //deux ennemis de plus par wave
		cpt_morts = 0;
		setTimeout(function(){id_wave.style.fontSize= "1em";}, 1000); //animation de grossissement de wave
	}
    
    IAEnemy();  //on dote chaque ennemi d'une IA et d'une physique
    
    if(div_hp_deja_cree && document.getElementById("hp_degat_joueur").style.display == "inline-block"){   //perte de vie du joueur
        document.getElementById("hp_degat_joueur").style.marginLeft = x_joueur +"px";
        document.getElementById("hp_degat_joueur").style.marginTop = y_joueur-15 +"px";
    }
    if(degat_joueur() && (nb_hp > 0)){
        joueur_perd_vie();
        setTimeout(function(){ //l'animation de perte de vie suit le joueur pdt 500ms
            document.getElementById("hp_degat_joueur").style.display = "none";
        }, 500);
    }
    
    if(keys[69] && intervalId_bullet === null){     //shoot si le tir précedent est terminé
        y_bullet = y_joueur+(j_height/2);			//on initialise les coordonnées
			x_bullet = x_joueur+(j_width-5); 		//de la balle à la pos du joueur en fct° de sa dir
		if(direction_j=="left"){
			x_bullet = x_joueur+5;
		}
        bullet.style.marginTop = y_bullet +"px";
        intervalId_bullet = setInterval(shoot, 20, direction_j, y_bullet, x_bullet, 400); //tir avec une range de 400px
    }

    
    if(keys[37]){
		speed_x = -12;
		direction_j= "left";
	}else if(keys[39]){
		speed_x = 12;
		direction_j= "right";
	}else
		speed_x = 0;
		
    //test collision avec gravité
    if(!collision(x_joueur, y_joueur, 0, speed_y) )
        speed_y += acceleration_y;
	else if(collision(x_joueur, y_joueur, 0, speed_y) ) //si on touche un plafond on tombe
        speed_y=0;
    if(keys[38]){  //jump
       if(collision(x_joueur, y_joueur, 0, speed_y) ) //si on touche le sol
           speed_y = -24;
    }
    
    if(!collision(x_joueur, y_joueur, speed_x, speed_y) ){ //Pas de collision sur côtés et en bas
		  x_joueur += speed_x; //dans ce cas on peut avancer
		  y_joueur += speed_y;
	}else if(!collision(x_joueur, y_joueur, speed_x, 0) ){ //Pas de collision sur côtés
		x_joueur += speed_x;
	}//si collision gauche/droite mais pas en bas on tombe
    else if(collision(x_joueur, y_joueur, speed_x, 0) && !collision(x_joueur, y_joueur, 0, speed_y) ){
        y_joueur += speed_y;
    }

    //si on touche le fond *ba-dum-tss*
    if(y_joueur+j_height+speed_y >= height_zonejeu || nb_hp <= 0){
        gameOver();
        return 0;
    }
    
    //fonction d'animation du sprite du joueur en fonction de la touche appuyée
	animationPlayer(direction_j);

	//actualisation coordonnées joueur
    document.getElementById("joueur").style.marginLeft= x_joueur +"px";
	document.getElementById("joueur").style.marginTop= (y_joueur+5) +"px";
	
	delai_hit += 40;
	delai_spawn += 40;
	time += 40;
    
 }
    
	setTimeout(Boucle, 40);
}


/*-------------------------------FONCTIONS-------------------------------*/

//1. MENU

function LaunchGame(){
    //fonction appellée quand on appuie sur "jouer" dans le menu SI SUR PC
    //on affiche / crée tout les éléments nécessaire au jeu et on lance la Boucle principale
    if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.getElementById("menu").style.display = "none";
        document.getElementById("wave").style.display = "inline-block";
        document.getElementById("hp_player").style.display = "inline-block";
        document.getElementById("hp_player_img").style.display = "inline-block";
        document.getElementById("pause").style.display = "block";
        document.getElementById("play").style.display = "block";
        InitPlayer();
        CreateMap();
        CreateEnemies();
        Boucle();
    }
}

function ShowRules(){
    document.getElementById("bouton_regles").style.display = "none";
    document.getElementById("rules").style.display = "inline-block";
    document.getElementById("close_rules").style.display = "block";
    document.getElementById("rules").innerHTML = 
    ("Attention, vous apercevez alors au loin des choses s'approchant vers vous, ressemblant étrangement à des... zombies ?!<br> Dégainez votre arme avec <img src='Sprites/Rules_img/keyboard_E_mini.png'> <br> Déplacez vous avec <img src='Sprites/Rules_img/keyboard_arrows_mini.png'> ");
}

function CloseRules(){
    document.getElementById("bouton_regles").style.display = "inline-block";
    document.getElementById("rules").style.display = "none";
    document.getElementById("close_rules").style.display = "none";
}

function PauseJeu(){
   if(pause == false)
       pause = true;
    else
        pause = false;
}

/*-------------------------------------*/

//2. BOX ET COLLISIONS

function InitBox(x, y, img){ 
    //Fonction qui crée un nouvel objet box à une position x,y avec une image de fond
    
    var box = document.createElement("img");
    if(img=="")
		box = document.createElement("div");
    
    box.style.display = "inline-block";
    box.style.width = width_box +"px";
    box.style.height = height_box +"px";
    box.style.marginLeft = x +"px";
    box.style.marginTop = y +"px";
    
    box.setAttribute("class", "box");
    zonejeu.insertBefore(box, joueur);
    
    //sprite qu'on veut comme image de fond
    if(img=="bord_g")
		box.src = "Sprites/Map/png/Tiles/Tile (1).png";
    if(img=="bord_haut")
		box.src = "Sprites/Map/png/Tiles/Tile (2).png";
    if(img=="bord_d")
		box.src = "Sprites/Map/png/Tiles/Tile (3).png";
    if(img=="interieur_g")
		box.src = "Sprites/Map/png/Tiles/Tile (4).png";
    if(img=="interieur_centre")
		box.src = "Sprites/Map/png/Tiles/Tile (5).png";
    if(img=="interieur_d")
		box.src = "Sprites/Map/png/Tiles/Tile (6).png";
    if(img=="bord_tourne_g")
		box.src = "Sprites/Map/png/Tiles/Tile (7).png";
    if(img=="interieur_tourne_bg")
		box.src = "Sprites/Map/png/Tiles/Tile (8).png";
    if(img=="interieur_b")
		box.src = "Sprites/Map/png/Tiles/Tile (9).png";
    if(img=="interieur_tourne_bd")
		box.src = "Sprites/Map/png/Tiles/Tile (10).png";
    if(img=="bord_tourne_d")
		box.src = "Sprites/Map/png/Tiles/Tile (11).png";
    if(img=="interieur_bg")
		box.src = "Sprites/Map/png/Tiles/Tile (12).png";
    if(img=="interieur_bd")
		box.src = "Sprites/Map/png/Tiles/Tile (13).png";
    if(img=="mini_g")
		box.src = "Sprites/Map/png/Tiles/Tile (14).png";
    if(img=="mini_haut")
		box.src = "Sprites/Map/png/Tiles/Tile (15).png";
    if(img=="mini_d")
		box.src = "Sprites/Map/png/Tiles/Tile (16).png";
    if(img=="squelette1")
		box.src = "Sprites/Map/png/Tiles/Bones (1).png";
    if(img=="squelette2")
		box.src = "Sprites/Map/png/Tiles/Bones (2).png";
    if(img=="boite")
		box.src = "Sprites/Map/png/Objects/Crate.png";

    map.push({ //propriétés d'une box
        width: width_box,
        height: height_box,
        x: x,
        y: y,
        div: box //le div de haque box pour le css
    });
}

function InitBackgroundImg(x, y, width, height, img){
	var img_bgd = document.createElement("img");
    /*Fonction qui crée un nouvel objet image_background
      à une position x,y avec une image de fond mais aussi une hauteur et largeur*/
    
    img_bgd.style.display = "inline-block";
    img_bgd.style.width = width +"px";
    img_bgd.style.height = height +"px";
    img_bgd.style.marginLeft = x +"px";
    img_bgd.style.marginTop = y +"px";

    img_bgd.setAttribute("class", "img_bgd");
    zonejeu.insertBefore(img_bgd, joueur);

	//sprite qu'on veut comme image de fond
    if(img=="bush1")
		img_bgd.src = "Sprites/Map/png/Objects/Bush (1).png";
    if(img=="bush2")
		img_bgd.src = "Sprites/Map/png/Objects/Bush (2).png";
    if(img=="bush3")
		img_bgd.src = "Sprites/Map/png/Objects/DeadBush.png";
    if(img=="tree")
		img_bgd.src = "Sprites/Map/png/Objects/Tree.png";
    if(img=="tombg1")
		img_bgd.src = "Sprites/Map/png/Objects/TombStone (1).png";
    if(img=="tombd2")
		img_bgd.src = "Sprites/Map/png/Objects/TombStone (2).png";
    if(img=="tombd1")
		img_bgd.src = "Sprites/Map/png/Objects/TombStoneInv (1).png";
    if(img=="tombg2")
		img_bgd.src = "Sprites/Map/png/Objects/TombStoneInv (2).png";
    if(img=="arrowsign")
		img_bgd.src = "Sprites/Map/png/Objects/ArrowSign.png";
    if(img=="arrowsign2")
		img_bgd.src = "Sprites/Map/png/Objects/ArrowSignInv.png";
    if(img=="sign")
		img_bgd.src = "Sprites/Map/png/Objects/Sign.png";
    if(img=="squelette")
		img_bgd.src = "Sprites/Map/png/Objects/Skeleton.png";
    if(img=="squelette1")
		img_bgd.src = "Sprites/Map/png/Tiles/Bones (1).png";
    if(img=="squelette2")
		img_bgd.src = "Sprites/Map/png/Tiles/Bones (2).png";  
    if(img=="squelette3")
		img_bgd.src = "Sprites/Map/png/Tiles/Bones (3).png";
    
    imagesbgd.push({
        div: img_bgd
    });
}

function CreateMap(){
    //Fonction où l'on crée la map (à la dure) !
    
    var i;
    for(i=1; i<=13; i++){  //Notre grande boucle permet de créer toutes les box, càd les img qu'on ne peut traverser (à une abscisse/ordonnée voulu)
        var y = height_zonejeu-(50*i); //une box a 50px de longueur
        for(j=0; j<=21; j++){
            var x =  50 * j;           //et 50px de largeur
            // on choisit les textures de chaque "case" de 50/50px
            if( (j<=1 && i==4) || (j>=4 && j<=13 && i==2) || (j>=18 && j<=21 && i==4) || (j>=6 && j<=14 && i==5)  ||  (j>=15 && j<=21 && i==9) )
                InitBox(x, y, "bord_haut");
            
            else if( (j==17 && i==4)  ||  (j==14 && i==9 ) || (j==5 && i==5) )
                InitBox(x, y, "bord_g");
            
            else if( (j==14 && i==2) || (j==2 && i==4) || (j==15 && i==5) )
                InitBox(x, y, "bord_d");
            
            else if( (j>=0 && j<=5 && i==13) || (j>=0 && j<=1 && i<=3) || (j==2 && i==1) || (j==3 && i==1) || (j>=4 && j<=13 && i<=2) || (j>=18 && j<=21 && i<=3) )
                InitBox(x, y, "interieur_centre");
            
            else if((j>=15 && j<=21) && (i==8) || (j>=6 && j<=14 && i==4) || (j>=0 && j<=5 && i==12) )
				InitBox(x, y, "interieur_b");
            
            else if( (j==17 && i<=3) )
				InitBox(x, y, "interieur_g");
            
            else if( (j==14 && i<=2) || (j==2 && i==3)  || (j==6 && i==13) )
				InitBox(x, y, "interieur_d");
            
			else if( (j==14) && (i==8) || (j==5 && i==4) )
				InitBox(x, y, "interieur_bg");
            
            else if( (j==15 && i==4)  || (j==6 && i==12) )
                InitBox(x, y, "interieur_bd");
            
            else if( (j==2 && i==2) )
                InitBox(x, y, "interieur_tourne_bd");
        
            else if( (j==3 && i==2) )
                InitBox(x, y, "bord_tourne_d");
            
            else if( (j>=0 && j<=4 && i==8) )
                InitBox(x, y, "mini_haut");
            
            else if( (j==5 && i==8) )
                InitBox(x, y, "mini_d");
            
			//blocs cachés sur côtés pour collisions
			else if(i>=1 && i<=13 && j==0)
				InitBox(-50, y, "");
			else if(i>=1 && i<=14 && j==21)
				InitBox(1100, y, "");
        }
    }
    
	//les images sans collisions à des endroits spécifiques
	InitBackgroundImg(390, 160, 286, 239, "tree");
    InitBackgroundImg(830, 151, 88, 49, "bush3");
    InitBackgroundImg(350, 531, 41, 19, "squelette");
	InitBackgroundImg(700, 516, 33, 34, "arrowsign");
	InitBackgroundImg(335, 236, 81, 40, "bush1");
    InitBackgroundImg(420, 575, 40, 40, "squelette1");
    InitBackgroundImg(1000, 500, 40, 40, "squelette2");
    InitBackgroundImg(780, 230, 30, 30, "squelette3");
    InitBackgroundImg(40, 220, 30, 30, "tombg1");
    InitBackgroundImg(10, 420, 30, 30, "tombd2");
    InitBackgroundImg(40, 500, 40, 40, "squelette3");
    InitBackgroundImg(1000, 170, 30, 30, "tombg2");
    InitBackgroundImg(950, 420, 30, 30, "tombd1");
    InitBackgroundImg(1000, 411, 81, 40, "bush2");
    InitBackgroundImg(590, 370, 30, 30, "tombd1");
    InitBackgroundImg(400, 370, 30, 30, "tombg1");
    InitBackgroundImg(420, 520, 30, 30, "tombd2");
    
    //les box à des endroits spécifiques
    InitBox(315, 275, "mini_g");
    InitBox(365, 275, "mini_haut");
    InitBox(415, 275, "mini_d");
    
    InitBox(149, 500, "boite");
    InitBox(150, 200, "boite");
    InitBox(520, 350, "boite");
    
    InitBox(550, 215, "mini_g");
    InitBox(600, 215, "mini_d");
    
}

function test_pt_ds_case(x, y, box){
    //comparaison d'une coordonnée avec une box
	return(x >= box.x && x <= box.x + box.width &&
		   y >= box.y && y <= box.y + box.height);
}

function collision_complete(x, y, offsetx, offsety){
	//detection
	var col=0;
	var test=true;
    
    //Pour chaque box, on compare si elle est touché par une coordoonnée maintenant, ou au prochain mouvement (avec les offset)
	map.forEach(function(box, index){
		if(test_pt_ds_case(offsetx + x, 			 offsety + y, box) ) col=1;  			//en haut à gauche
		if(test_pt_ds_case(offsetx + x + j_width,    offsety + y, box) ) col=1;  			//en haut à droite
		if(test_pt_ds_case(offsetx + x, 			 offsety + y + j_height, box) ) col=2;  //en bas à gauche
		if(test_pt_ds_case(offsetx + x + j_width,    offsety + y + j_height, box) ) col=2;  //en bas à droite
	});
	return col;
}

function collision(x, y, offsetx, offsety){
    //return true si il y a collision
    if(collision_complete(x, y, offsetx, offsety) > 0 ) return true; else return false;
}


/*-------------------------------------*/

//3. JOUEUR ET TOUT CE QUI VA AVEC

function InitPlayer(){
    //propriétés css et création de l'objet avec l'id joueur dans le html
    var joueur = document.createElement("img");
    
    joueur.style.display= "inline-block";
    joueur.style.position= "absolute";
    joueur.style.width= j_width+7 +"px";
    joueur.style.height= j_height +"px";
    joueur.style.marginLeft= x_joueur +"px";
    joueur.style.marginTop= y_joueur+3 +"px";
    joueur.setAttribute("id", "joueur");
    zonejeu.insertBefore(joueur, bullet);
    
    joueur.src="Sprites/Character/robot/Jump (4).png" //img de base
}

function animationPlayer(direction){
    //step est une variable globale qui est incrémenté chaque tour de boucle si on entre dans une des conditions ici
    if(keys[37]){	      //gauche
        document.getElementById("joueur").src="Sprites/Character/robot/RunInv ("+step+").png";
        step++;
    }
    else if(keys[39]){	  //droite
        document.getElementById("joueur").src="Sprites/Character/robot/Run ("+step+").png";
        step++;
    }
    else if(direction == "right" && speed_x == 0 && speed_y == 0 && !keys[69]){ //bouge pas vers droite
        document.getElementById("joueur").src="Sprites/Character/robot/Idle ("+step+").png";
        step++;
    }
    else if(direction == "left" && speed_x == 0 && speed_y == 0 && !keys[69]){ //bouge pas vers gauche
        document.getElementById("joueur").src="Sprites/Character/robot/IdleInv ("+step+").png";
        step++;
    }
    /*pour les prochaines mvmts pas d'animation mais une seule image, donc pas besoin du compteur step*/
    else if(keys[38] && direction == "right"){	//saut droite
        document.getElementById("joueur").src="Sprites/Character/robot/Jump (4).png";
    }
    else if(keys[38] && direction == "left"){	//saut gauche
        document.getElementById("joueur").src="Sprites/Character/robot/JumpInv (4).png";
    }
    else if(keys[69] && direction == "right"){	//shoot droite
        document.getElementById("joueur").src="Sprites/Character/robot/Shoot (4).png";
        bullet.src="Sprites/Character/robot/Objects/Bullet_000.png";
    }
    else if( keys[69] && direction == "left"){	//shoot gauche
        document.getElementById("joueur").src="Sprites/Character/robot/ShootInv (4).png";
        bullet.src="Sprites/Character/robot/Objects/BulletInv_000.png";
    }
    
    if(step==8) {step=1;} //on recommence l'animation si on est au bout
}

function shoot(direction, y_bullet, x_bullet_origin, distance_x){
    var speed_x_bullet;
    var bullet_touche_ennemi = false; //permet de savoir si la balle touche un ennemi pour disparaître
    var bullet_touche_meme_x = false; //permet de savoir si la balle a touche un ennemi à un x et y donné pour ne pas en tuer plusieurs en même temps
    var x_enemy_toucher = 0;
    var y_enemy_toucher = 0;
    
    enemies.forEach(function(enemy, index){
        
        //si on touche un ennemi la balle s'arrête et il disparaît
        if( ( (x_bullet >= enemy.x && x_bullet <= enemy.x+enemy.width) && (y_bullet > enemy.y && y_bullet <= enemy.y+enemy.height) && (enemy.div.style.display == "inline-block") ) ){
			if(!bullet_touche_meme_x){       //si on touche un ennemi à des x,y donnés, on les sauvegarde
				x_enemy_toucher = enemy.x;
				y_enemy_toucher = enemy.y;
			}
			if( (bullet_touche_meme_x==false) || (bullet_touche_meme_x==true && (x_enemy_toucher != enemy.x && y_enemy_toucher != enemy.y) ) ){
				bullet_touche_meme_x=true; //si on a encore touché personne, on prend la valeur true, sinon, ↑ on vérifie que ce ne sont pas les mêmes x,y
				bullet_touche_ennemi=true;
				bullet.style.display = "none";
				cpt_morts++;
				enemy.div.style.display = "none"; //Suppresion de l'ennemi de la zonejeu ↓
                $(".enemy:hidden").remove();
				clearInterval(intervalId_bullet);
				intervalId_bullet = null;
            }
        }
		else if(direction=="right" && ( x_bullet < x_bullet_origin+distance_x && x_bullet+10 < width_zonejeu ) && (bullet_touche_ennemi==false) ){ //si on tire à droite, balle → 
			bullet.style.display = "inline-block";
			bullet.style.marginLeft = x_bullet +"px";
			speed_x_bullet = 10;
		}else if(direction=="left" && ( x_bullet > x_bullet_origin-distance_x && x_bullet > 0 ) && (bullet_touche_ennemi==false) ){ //si on tire à gauche, balle ←
			bullet.style.display = "inline-block";
			bullet.style.marginLeft = x_bullet +"px";
			speed_x_bullet = -10;
		}
		
        //si la balle ne touche rien / elle atteint sa distance max, elle disparaît
        else if( (x_bullet >= x_bullet_origin+distance_x) || (x_bullet <= x_bullet_origin-distance_x) || (x_bullet-bullet_width <= 0) || (x_bullet+bullet_width >= width_zonejeu) ){ 
				bullet.style.display = "none";
				clearInterval(intervalId_bullet);
				intervalId_bullet = null;
        }
        
    });
    
    //si la balle touche une box, elle disparaît
    if(collision(x_bullet, y_bullet-(j_height/2), 0, 0) ){
        bullet.style.display = "none";
        clearInterval(intervalId_bullet);
        intervalId_bullet = null;
    }
    
    x_bullet += speed_x_bullet; //on incrémente la valeur avec la nouvelle vitesse s'il y en a
}

function degat_joueur(){
    var j_toucher = false;
	if(delai_hit >= 1000){ //on peut prendre des dégats ttes les 1sec max
		delai_hit = 0;
		enemies.forEach(function(enemy, index){     //si le zombie touche le joueur et qu'il n'est pas mort, j_toucher = true
			if( nb_hp > 0 && (enemy.x >= x_joueur && enemy.x <= x_joueur+j_width) && (enemy.y >= y_joueur-5 && enemy.y <= y_joueur+j_height) && enemy.div.style.display == "inline-block"){   
				j_toucher = true;
			}
		});
		if(j_toucher){ //si on a été touché par au moins un ennemi, on perd 1HP
			nb_hp--;
			document.getElementById("hp_player").innerHTML="<b> "+nb_hp+"/5 HP </b>"; //on change l'affichage
            return true;
		}
	}
}

function joueur_perd_vie(){
    //petite animation au dessus du perso indiquant une perte de vie
    if(!div_hp_deja_cree){ //on crée un div s'il n'existe pas
        var hp_degat_joueur = document.createElement("div");

        hp_degat_joueur.style.position= "absolute";
        hp_degat_joueur.style.width= 50 +"px";
        hp_degat_joueur.style.color= "brown";
        hp_degat_joueur.setAttribute("id", "hp_degat_joueur");
        zonejeu.insertBefore(hp_degat_joueur, bullet);

        hp_degat_joueur.innerHTML = "<b> -1 HP </b>";
        div_hp_deja_cree = true;
    }
    //on le fait suivre le joueur
    document.getElementById("hp_degat_joueur").style.marginLeft = x_joueur +"px";
    document.getElementById("hp_degat_joueur").style.marginTop = y_joueur-15 +"px";
    document.getElementById("hp_degat_joueur").style.display = "inline-block";
}

/*-------------------------------------*/

//4. ENNEMIS ET TOUT CE QUI VA AVEC

function InitEnemy(x, y){ 
    //propriétés css et création des objets avec la class enemy dans le html
    var enemy = document.createElement("img");
    var fm = 'f'; //sex = female de base
    
    enemy.style.display= "inline-block";
    enemy.style.width= j_width/*-7*/ +"px";
    enemy.style.height= j_height +"px";
    enemy.style.marginLeft= x +"px";
    enemy.style.marginTop= y+3 +"px";
    enemy.setAttribute("class", "enemy");
    zonejeu.insertBefore(enemy, joueur);
    
    //création aléatoire du sprite du zombie
    var rand= Math.floor (1 + (Math.random() *(2)) );
    var enmImg = "Sprites/Character/female/Walk (1).png";
    if(rand == 2){
        enmImg = "Sprites/Character/male/Walk (1).png";
        fm = 'm'; //male
    }
    enemy.src=enmImg;
    enemies.push({
        div: enemy,             //le div enemy avec les props css
        img: enmImg,            //l'url de l'image en string
        sex: fm,                //'f' = fille / 'm' = garçon
        width: j_width,
        height: j_height,
        speed_x: speed_x_enemy, //vitesses respectives dans
        speed_y: speed_y_enemy, //les deux sens
        x: x,
        y: y
    });
}

function CreateEnemies(){
    
    var x; var y;
    var rand;
	
    //verification pour savoir s'il reste des enemis à faire spawn, et si le délai est terminé
    if(delai_spawn >= 1000 && ennemis_a_spawn > 0){
        //spawn aléatoire entre 7 spots
		rand = Math.floor (1 + (Math.random() *(8)) );
		if(rand == 1){
			x = 30;
			y = 205;
        }else if(rand == 2){
			x = 5;
			y = 405;
        }else if(rand == 3 || rand == 8){
			x = 990;
			y = 155;
        }else if(rand == 4){
			x = 940;
			y = 405;
        }else if(rand == 5){
			x = 580;
			y = 355;
        }else if(rand == 6){
			x = 390;
			y = 355;
        }else if(rand == 7){
			x = 415;
			y = 505;
        }
        
        delai_spawn = 0;   //actualisation
		InitEnemy(x, y);   
		ennemis_a_spawn--; //des vars globales
    }
}

function animationEnemy(){
    enemies.forEach(function(enemy, index){ //pour chaque zombie
        
		if(enemy.div.style.display == "inline-block"){ //si le zombie est vivant
            
			if(enemy.sex == 'm'){   //si le zombie est un garçon
				if( (enemy.x >= x_joueur && enemy.x <= x_joueur+j_width) && (enemy.y >= y_joueur-5 && enemy.y <= y_joueur+j_height) ){ //si touche joueur
					if( enemy.x >= x_joueur && enemy.x < x_joueur+(j_width/2) )        //attaque vers droite
						enemy.img = "Sprites/Character/male/Attack ("+step+").png";
					else if(enemy.x <= x_joueur+j_width && enemy.x > x_joueur+(j_width/2) )
						enemy.img = "Sprites/Character/male/AttackInv ("+step+").png"; //attaque vers droite
					
					enemy.div.src = enemy.img;
					step_e++;
				}
                else if(enemy.speed_x >= -6 && enemy.speed_x <= -3){ //si le zombie ne voit pas le joueur
					enemy.img = "Sprites/Character/male/WalkInv ("+step+").png";
					enemy.div.src = enemy.img;
					step_e++;
				}else if(enemy.speed_x >= 3){
					enemy.img = "Sprites/Character/male/Walk ("+step+").png";
					enemy.div.src = enemy.img;
					step_e++;
				}
			}
            
			if(enemy.sex == 'f'){   //si le zombie est une fille
				if( (enemy.x >= x_joueur && enemy.x <= x_joueur+j_width) && (enemy.y >= y_joueur-5 && enemy.y <= y_joueur+j_height) ){
					if( enemy.x >= x_joueur && enemy.x < x_joueur+(j_width/2) )
						enemy.img = "Sprites/Character/female/Attack ("+step+").png"; 
					else if(enemy.x <= x_joueur+j_width && enemy.x > x_joueur+(j_width/2) )
						enemy.img = "Sprites/Character/female/AttackInv ("+step+").png";

					enemy.div.src = enemy.img;
					step_e++;
				}
                else if(enemy.speed_x >= -6 && enemy.speed_x <= -3){
					enemy.img = "Sprites/Character/female/WalkInv ("+step+").png";
					enemy.div.src = enemy.img;
					step_e++;
				}else if(enemy.speed_x >= 3){
					enemy.img = "Sprites/Character/female/Walk ("+step+").png";
					enemy.div.src = enemy.img;
					step_e++;
				}
			}
            
		}
        
        if(step_e==8) {step_e=1;}
        
    });
}

function IAEnemy(){
    
    enemies.forEach(function(enemy, index){
        
        if(enemy.div.style.display == "inline-block"){  // si l'ennemi n'est pas mort il peut bouger
            
            //test collision avec gravité
            if(!collision(enemy.x, enemy.y, 0, enemy.speed_y) && (enemy.y+j_height+enemy.speed_y <= height_zonejeu) )
                enemy.speed_y += acceleration_y;
            else if(collision(enemy.x, enemy.y, 0, enemy.speed_y) || collision(enemy.x, enemy.y, enemy.speed_x, enemy.speed_y) ) //si zombie touche un plafond, il tombe
                enemy.speed_y = 0;
            
            
            if(enemy.y >= y_joueur-120 && enemy.y <= y_joueur+115){ // si le zombie "voit" le joueur
                
                if( (enemy.x >= x_joueur && enemy.x <= x_joueur+(j_width-10)) && (enemy.y >= y_joueur-5 && enemy.y <= y_joueur+j_height) )  //si zombie touche le joueur
                    enemy.speed_x = 0;
                else if(x_joueur < enemy.x)     	//si ennemi à droite du joueur
                    enemy.speed_x = -6;
                else if(enemy.x < x_joueur) 	    //si ennemi à gauche du joueur
                    enemy.speed_x = 6;

                //si on est sur le sol
                if(collision(enemy.x, enemy.y, 0, enemy.speed_y) ){     //si il touche le sol, saut sous conditions
                    if(enemy.x != x_joueur && ( (collision(enemy.x, enemy.y, enemy.speed_x, 0) ) || ( (enemy.y >= y_joueur) && !collision(enemy.x, enemy.y, enemy.speed_x*2, enemy.speed_y) ) ) )
                        enemy.speed_y = -26;
                }

                if(!collision(enemy.x, enemy.y, enemy.speed_x, enemy.speed_y) ){ //Pas de collision sur côtés et en bas
                      enemy.x += enemy.speed_x;
                      enemy.y += enemy.speed_y;
                }else if(!collision(enemy.x, enemy.y, enemy.speed_x, 0) ){ //Pas de collision sur côtés
                    enemy.x += enemy.speed_x;
                }else if(collision(enemy.x, enemy.y, enemy.speed_x, 0) && !collision(enemy.x, enemy.y, 0, enemy.speed_y) ){ //si collision gauche/droite mais pas en bas on tombe / en haut on saute
                    enemy.y += enemy.speed_y;
                }
                
            }
                
            else{ //s'il ne le voit pas, il rôde
                if(!collision(enemy.x, enemy.y, 0, enemy.speed_y) ) //zombie tombe seulement si touche pas sol
                    enemy.y += enemy.speed_y;
                
                if(enemy_touche_cote=="false" || enemy_touche_cote=="droite") //s'il touche un obstacle, il change de direction
                    enemy.speed_x = -3;
                if(!collision(enemy.x, enemy.y, enemy.speed_x, 0) && collision(enemy.x, enemy.y, 0, acceleration_y) ){
                    enemy.x += enemy.speed_x;
                }else{
                    enemy_touche_cote = "gauche";
                    enemy.speed_x = 3;
                    if(!collision(enemy.x, enemy.y, enemy.speed_x, 0) && collision(enemy.x, enemy.y, 0, acceleration_y) ){
                        enemy.x += enemy.speed_x;
                    }else{
                        enemy_touche_cote = "droite";
                    }
                }
            }
            
            //actualisation des coordonnées du css
            enemy.div.style.marginLeft = enemy.x +"px";
            enemy.div.style.marginTop = enemy.y+3 +"px";
            animationEnemy();
            
            //si un ennemi tombe de haut (meurt)
            if(enemy.y+j_height+enemy.speed_y >= height_zonejeu){
                cpt_morts++;
                enemy.div.style.display = "none"; //Suppresion de l'ennemi de la zonejeu ↓
                $(".enemy:hidden").remove();
            }
        }
        
	});
}

/*-------------------------------------*/

//5.FIN DU GAME

function gameOver(){
        speed_y=0;
        y_joueur = height_zonejeu;
        enemies.forEach(function(enemy, index){ enemy.div.style.display = "none"; });
        map.forEach(function(box, index){ box.div.style.display="none"; });
        imagesbgd.forEach(function(img_bgd, index){ img_bgd.div.style.display="none"; });
    
        document.getElementById("wave").style.display = "none";
        document.getElementById("bullet").style.display = "none";
        document.getElementById("hp_player").style.display = "none";
        document.getElementById("hp_player_img").style.display = "none";
        document.getElementById("joueur").style.display = "none";
        document.getElementById("titre_zonejeu").innerHTML = "GAME OVER";
        document.getElementById("menu").style.display= "inline-block";
        document.getElementById("boutons_menu").style.display= "none";
        
       // var nom_joueur="Bassem";
        wave = wave-1;
        time /= 1000; // implémentation des données du joueur courant dans la BDD
        document.getElementById("txt_perdu").innerHTML = "<p>vous avez survécu jusqu'à la manche "+wave+"</p> <p> Redirection vers le tableau des scores... </p>";
        setInterval(function(){
            window.location = "enregistrer_scores.php?wave="+wave+"&time="+time;
        }, 1500);
}


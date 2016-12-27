<?php 
    session_start();
?>

<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8"/>
		<title>Zombilluminati Game</title>
		<link rel="stylesheet" href="design_and_sound/style_jeu.css" />
        <link rel="icon" type="image/png" href="design_and_sound/kanyefavicon.png" />
	</head>

	<body>

        <?php include ('header.php'); ?>
        
        <?php
        
            if( isset($_POST['pseudo']) ){ //on prend le pseudo choisi en session
                $_SESSION['pseudo'] = $_POST['pseudo'];
            }
        
            if( !isset($_SESSION['pseudo']) ){ //est-ce qu'on a déjà entré un pseudo ?
                echo '<div id="overlay">
                    <div id="boiteconnexion">
                        <h2>Bienvenue sur <span id="titre">Zombilluminati</span> !</h2><br>
                        <p id="txt">Zombilluminati  est un jeu dans un environnement en 2D où vous incarnez un robot avec comme seul donnée dans sa mémoire, son identifiant : BEC-5991</p>
                        <p>Vous devrez survivre le plus longtemps à des hordes de zombies grâce à votre bras armé !</p>
                        <p>PS : Attention aux oreilles si votre son est très fort, il y a une musique de fond pour le jeu.</p><br><br>
                        <hr><br>
                        <p>Entrez votre pseudo/nom pour pouvoir jouer et avoir accès à toutes les fonctionnalités du site !</p>
                        <form method="POST">
                            <input name="pseudo" type="text" placeholder="Ex: John Doe" required> <br><br>
                            <input id="pseudo" name="connexion" type="submit" value="Je valide !">
                        </form>';
                        if( isset($_POST['pseudo']) )
                            echo'<script type="text/javascript"> document.getElementByID("pseudo").onclick="fermeroverlay()" </script>';
                   echo'</div>
                </div>';
            }
        
        ?>

        <input type="image" id="play" onclick="play()" src="Sprites/Rules_img/vol_off.png">
        
		<div id="zonejeu">
            
			<div id="menu">
				<p id="titre_zonejeu">ZOMBILLUMINATI</p>
				<div id="txt_perdu"></div>
				<form id="boutons_menu">
					<input id="bouton_jouer" type='button' onclick="LaunchGame(), play()" value='Jouer'/> <br><br>
					<input id="bouton_regles" type='button' onclick="ShowRules()" value='Touches'/>
					<p id="rules"></p><p id="close_rules" onclick="CloseRules()">Fermer</p>
				</form>
			</div>
            
			<img id="bullet" src="Sprites/Character/robot/Objects/Bullet_000.png">
            <img id="hp_player_img" src="Sprites/Character/robot/Objects/hpmax.png"> <div id="hp_player"><b>5/5 HP</b></div>
			<div id="wave"><b>VAGUE 1</b></div>
            <input id="pause" type="button" value="Pause" onclick="PauseJeu()">
            
		</div>

		<div id="loading"> <!-- pour pouvoir charger les images sur le cache (à la dure, et à améliorer donc) -->
            <img class="test" src="Sprites/Character/robot/Jump (4).png">
            <img class="test" src="Sprites/Character/robot/JumpInv (4).png">
            <img class="test" src="Sprites/Character/robot/Shoot (4).png">
            <img class="test" src="Sprites/Character/robot/Objects/BulletInv_000.png">
            <img class="test" src="Sprites/Character/robot/ShootInv (4).png">
            <img class="test" src="Sprites/Character/robot/Idle (1).png">
            <img class="test" src="Sprites/Character/robot/Idle (2).png">
            <img class="test" src="Sprites/Character/robot/Idle (3).png">
            <img class="test" src="Sprites/Character/robot/Idle (4).png">
            <img class="test" src="Sprites/Character/robot/Idle (5).png">
            <img class="test" src="Sprites/Character/robot/Idle (6).png">
            <img class="test" src="Sprites/Character/robot/Idle (7).png">
            <img class="test" src="Sprites/Character/robot/Idle (8).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (1).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (2).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (3).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (4).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (5).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (6).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (7).png">
            <img class="test" src="Sprites/Character/robot/IdleInv (8).png">        
            <img class="test" src="Sprites/Character/robot/Run (1).png">
            <img class="test" src="Sprites/Character/robot/Run (2).png">
            <img class="test" src="Sprites/Character/robot/Run (3).png">
            <img class="test" src="Sprites/Character/robot/Run (4).png">
            <img class="test" src="Sprites/Character/robot/Run (5).png">
            <img class="test" src="Sprites/Character/robot/Run (6).png">
            <img class="test" src="Sprites/Character/robot/Run (7).png">
            <img class="test" src="Sprites/Character/robot/Run (8).png">
            <img class="test" src="Sprites/Character/robot/RunInv (1).png">
            <img class="test" src="Sprites/Character/robot/RunInv (2).png">
            <img class="test" src="Sprites/Character/robot/RunInv (3).png">
            <img class="test" src="Sprites/Character/robot/RunInv (4).png">
            <img class="test" src="Sprites/Character/robot/RunInv (5).png">
            <img class="test" src="Sprites/Character/robot/RunInv (6).png">
            <img class="test" src="Sprites/Character/robot/RunInv (7).png">
            <img class="test" src="Sprites/Character/robot/RunInv (8).png">   

            <img class="test" src="Sprites/Character/male/Walk (1).png">
            <img class="test" src="Sprites/Character/male/Walk (2).png">
            <img class="test" src="Sprites/Character/male/Walk (3).png">
            <img class="test" src="Sprites/Character/male/Walk (4).png">
            <img class="test" src="Sprites/Character/male/Walk (5).png">
            <img class="test" src="Sprites/Character/male/Walk (6).png">
            <img class="test" src="Sprites/Character/male/Walk (7).png">
            <img class="test" src="Sprites/Character/male/Walk (8).png">
            <img class="test" src="Sprites/Character/male/WalkInv (1).png">
            <img class="test" src="Sprites/Character/male/WalkInv (2).png">
            <img class="test" src="Sprites/Character/male/WalkInv (3).png">
            <img class="test" src="Sprites/Character/male/WalkInv (4).png">
            <img class="test" src="Sprites/Character/male/WalkInv (5).png">
            <img class="test" src="Sprites/Character/male/WalkInv (6).png">
            <img class="test" src="Sprites/Character/male/WalkInv (7).png">
            <img class="test" src="Sprites/Character/male/WalkInv (8).png">        
            <img class="test" src="Sprites/Character/male/Attack (1).png">
            <img class="test" src="Sprites/Character/male/Attack (2).png">
            <img class="test" src="Sprites/Character/male/Attack (3).png">
            <img class="test" src="Sprites/Character/male/Attack (4).png">
            <img class="test" src="Sprites/Character/male/Attack (5).png">
            <img class="test" src="Sprites/Character/male/Attack (6).png">
            <img class="test" src="Sprites/Character/male/Attack (7).png">
            <img class="test" src="Sprites/Character/male/Attack (8).png">
            <img class="test" src="Sprites/Character/male/AttackInv (1).png">
            <img class="test" src="Sprites/Character/male/AttackInv (2).png">
            <img class="test" src="Sprites/Character/male/AttackInv (3).png">
            <img class="test" src="Sprites/Character/male/AttackInv (4).png">
            <img class="test" src="Sprites/Character/male/AttackInv (5).png">
            <img class="test" src="Sprites/Character/male/AttackInv (6).png">
            <img class="test" src="Sprites/Character/male/AttackInv (7).png">
            <img class="test" src="Sprites/Character/male/AttackInv (8).png">

            <img class="test" src="Sprites/Character/female/Walk (1).png">
            <img class="test" src="Sprites/Character/female/Walk (2).png">
            <img class="test" src="Sprites/Character/female/Walk (3).png">
            <img class="test" src="Sprites/Character/female/Walk (4).png">
            <img class="test" src="Sprites/Character/female/Walk (5).png">
            <img class="test" src="Sprites/Character/female/Walk (6).png">
            <img class="test" src="Sprites/Character/female/Walk (7).png">
            <img class="test" src="Sprites/Character/female/Walk (8).png">
            <img class="test" src="Sprites/Character/female/WalkInv (1).png">
            <img class="test" src="Sprites/Character/female/WalkInv (2).png">
            <img class="test" src="Sprites/Character/female/WalkInv (3).png">
            <img class="test" src="Sprites/Character/female/WalkInv (4).png">
            <img class="test" src="Sprites/Character/female/WalkInv (5).png">
            <img class="test" src="Sprites/Character/female/WalkInv (6).png">
            <img class="test" src="Sprites/Character/female/WalkInv (7).png">
            <img class="test" src="Sprites/Character/female/WalkInv (8).png">        
            <img class="test" src="Sprites/Character/female/Attack (1).png">
            <img class="test" src="Sprites/Character/female/Attack (2).png">
            <img class="test" src="Sprites/Character/female/Attack (3).png">
            <img class="test" src="Sprites/Character/female/Attack (4).png">
            <img class="test" src="Sprites/Character/female/Attack (5).png">
            <img class="test" src="Sprites/Character/female/Attack (6).png">
            <img class="test" src="Sprites/Character/female/Attack (7).png">
            <img class="test" src="Sprites/Character/female/Attack (8).png">
            <img class="test" src="Sprites/Character/female/AttackInv (1).png">
            <img class="test" src="Sprites/Character/female/AttackInv (2).png">
            <img class="test" src="Sprites/Character/female/AttackInv (3).png">
            <img class="test" src="Sprites/Character/female/AttackInv (4).png">
            <img class="test" src="Sprites/Character/female/AttackInv (5).png">
            <img class="test" src="Sprites/Character/female/AttackInv (6).png">
            <img class="test" src="Sprites/Character/female/AttackInv (7).png">
            <img class="test" src="Sprites/Character/female/AttackInv (8).png">
        </div>

        <script type="text/javascript"> 
            //toute la partie pour la musique de fond
            var audio = new Audio('design_and_sound/Come_and_Find_Me.mp3');
            var is_playing = true;
            audio.volume = 0.2;
            audio.loop = true;
            
            function play(){
                is_playing = !is_playing;
                if (!is_playing){
                    audio.play();
                    document.getElementById("play").src = "Sprites/Rules_img/vol_on.png";
                }else{
                    audio.pause();
                    document.getElementById("play").src = "Sprites/Rules_img/vol_off.png";
                }
            }
                
            function fermeroverlay(){ //changement d'affichage en validant le pseudo
	           document.getElementById("overlay").style.display = "none";
            }

            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) //affichage du jeu seulement pour les non téléphones
                document.getElementById("boiteconnexion").innerHTML = "<p> Bienvenue sur Zombilluminati !</p> <p> Si vous voyez ce message c'est que vous êtes sur mobile. <br> Désolé, mais le jeu ne supporte pas cette version pour le moment. </p> <p> Vous pouvez tout de même accéder aux autres fonctionnalités du site via les liens sur la bannière !</p>";
                
        </script>

        <script src="//code.jquery.com/jquery-1.12.0.js"> </script>
		<script type="text/javascript" src="script_jeuV1.js"> </script>

        <footer>
            <p>Site créé par YAGOUB Bassem, tous droits réservés ©.</p>
            <p>Pour tout contact <a href="mailto:yagoub.bassem@gmail.com"> c'est ici</a></p>
        </footer>

	</body>
</html>



<?php
	
    function inserer_commentaire(){
        if( isset($_POST["commentaires"]) AND isset($_SESSION["pseudo"]) ){
            $pdo = new PDO("mysql:host=localhost; dbname=zombilluminati", "root", "root");
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
            $commentaire_present = false;
            foreach($pdo->query("SELECT pseudo, commentaire FROM commentaires") as $row){
                if($_SESSION['pseudo'] == $row['pseudo'] AND $_POST['commentaires'] == $row['commentaire']){
                    $commentaire_present = true;
                    return 0;
                }
            }
            
            if(!$commentaire_present){
                $rqt = $pdo->prepare("INSERT INTO commentaires (pseudo, date, commentaire) VALUES (:val1, curtime(), :val2)");
                $rqt->bindParam(":val1",$_SESSION['pseudo']);
                $rqt->bindParam(":val2",$_POST["commentaires"]);
                $rqt->execute();
            }
        }
    }

	//Saisie du commentaire 
	function commenter(){
		if(isset($_SESSION["pseudo"])){
            echo'<form action="feedbacks.php" method="POST"><br>';
                echo ' <p>'.htmlspecialchars($_SESSION['pseudo']).' :</p>
                <textarea id="zonetexte" maxlength="300" rows="10" cols="30" name="commentaires" placeholder="Vous pouvez donner votre avis ici ! (300 caractères max)"></textarea><br>
                <input id="commenter" type="submit" value="commenter"><br>
            </form><br><hr><br><br>';
        }
        else
            echo "<h3 id='avertissement'>Pour donner un avis sur le site, il faut d'abord avoir essayé le jeu !</h3>";
	}
	
	//Fonctions d'affichage des commenataires
	function affiche_commentaires(){
        $pdo = new PDO("mysql:host=localhost; dbname=zombilluminati", "root", "root");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        
        setlocale(LC_TIME, 'french');
        
        echo '<div id="espace_commentaire">';
            foreach($pdo->query("SELECT * FROM commentaires ORDER BY id desc") as $row){
                echo "<br>".htmlspecialchars($row['pseudo'])." <span id='date_commentaire'>".utf8_encode(strftime('%A %d %B %Y %H:%M ', strtotime($row['date']) ))."</span><br> 
                        <p class='commentaires'>".htmlspecialchars($row['commentaire'])."</p>
                    <br><hr id='separation_commentaires'><br>";
            }
        echo '</div>';
    }

    function newsletter(){
        if(isset($_POST['mail'])){
            $pdo = new PDO("mysql:host=localhost; dbname=zombilluminati", "root", "root");
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
            $deja_cree = false;
            foreach($pdo->query("SELECT mail FROM newsletter") as $row){
                if($_POST['mail'] == $row['mail']){
                    $deja_cree = true;
                    echo '<p> Vous avez déjà été inscrit à la newsletter ! </p>';
                    return 0;
                }
            }
            
            if(!$deja_cree){
                $rqt = $pdo->prepare("INSERT INTO newsletter (mail) VALUES (:mail)");
                $rqt->bindParam(":mail", $_POST['mail']);
                $rqt->execute();
                
                echo '<p> Vous avez bien été inscrit à la newsletter ! </p>';
            }
        }
    }

    function changerPseudo(){
        if(isset($_POST['newpseudo']) ){
                $_SESSION['pseudo'] = $_POST['newpseudo'];
                echo 'Vous avez bien changé de pseudo.';
            }
    }

?>
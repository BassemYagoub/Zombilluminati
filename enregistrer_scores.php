
<?php
    session_start();

    //pour ne pas avoir de problèmes quand on actualise la page de scores on crée cette page intermédiaire où on mets les données dans la bdd

    $pdo = new PDO("mysql:host=localhost; dbname=zombilluminati", "root", "root");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    
    $tempsmin = 0;
    $wave = $_GET['wave']-1;

    while($wave >= 1){
        $tempsmin += $wave * 2;
        if($wave==1)
            $tempsmin += 2;
        $wave--;
    }
    
    //sécurité pour le get
    if(isset($_SESSION['pseudo']) AND isset($_GET['wave']) AND $_GET['wave'] < 75 AND $_GET['time'] > $tempsmin AND $_GET['time'] < $_GET['wave']*70 ){

        $score_present = false;
        foreach($pdo->query("SELECT pseudo, vague, duree_partie FROM scores_jeu") as $row){ //pour éviter les doublons
            if($_SESSION['pseudo'] == $row['pseudo'] AND $_GET['wave'] == $row['vague'] AND $_GET['time'] == $row['duree_partie'] ){
                $score_present = true;
            }
        }

        if(!$score_present){
            $rqt = $pdo->prepare("INSERT INTO scores_jeu (pseudo, vague, duree_partie, temps) VALUES (:pseudo, :wave, :temps, curdate())");
            $rqt->bindParam(":pseudo", $_SESSION['pseudo']);
            $rqt->bindParam(":wave", $_GET['wave']);
            $rqt->bindParam(":temps", $_GET['time']);
            $rqt->execute();
        }
    }
    
    header('location:scores_jeu.php'); //page qui affiche tous les scores
?>
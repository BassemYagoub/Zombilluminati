
<?php
	session_start();
    include('commenter.php');
?>

<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8"/>
		<title>Zombilluminati Scores</title>
		<link rel="stylesheet" href="design_and_sound/style.css" />
        <link rel="icon" type="image/png" href="design_and_sound/kanyefavicon.png" />

        <script src="//code.jquery.com/jquery-1.12.0.js"> </script>
        <script type="text/javascript" src="Table_sorter/jquery.tablesorter.js"></script>
        <script type="text/javascript">
            $(document).ready(function(){ $("#table_scores").tablesorter(); } );
        </script>
	</head>

    <body>
        
		<?php include ('header.php'); ?>
		
        <div id="newsletter">
            <p>Si vous voulez être tenu au courant des prochaines mises à jour du site, vous avez juste à joindre votre mail ici :</p>
            <form action="scores_jeu.php" method="POST">
                <input id="mail" name="mail" type="email" placeholder="Renseignez votre mail ici !" required>
                <input id="inscription_news" type="submit" value="M'inscrire"><br>
            </form>
            <?php newsletter(); ?>
        </div>        

        <div id="change_pseudo">
            <p>Si vous voulez modifier votre pseudo :</p>
            <form action="scores_jeu.php" method="POST">
                <input id="newpseudo" name="newpseudo" type="text" placeholder="Entrez votre nouveau pseudo" required>
                <input type="submit" value="Valider"><br>
            </form>
            <?php changerPseudo(); ?>
        </div>
            
        <div id="main_tableau">
			<table id="table_scores" class="tablesorter">
				<thead><tr>
					<th title="Cliquez pour trier">Classement</th>
                    <th title="Cliquez pour trier">Joueur</th>
					<th title="Cliquez pour trier">Dernière Vague</th>
					<th title="Cliquez pour trier">Durée</th>
					<th title="Cliquez pour trier">Date</th>
				</tr></thead>
		
                <?php
                
                    $pdo = new PDO("mysql:host=localhost; dbname=zombilluminati", "root", "root");
                    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                    $i=1;
                    foreach($pdo->query("SELECT * FROM scores_jeu ORDER BY vague desc, duree_partie desc") as $row){
                        $dureeSecondes = round($row["duree_partie"]);
                        $date = new DateTime("00:00:00");
                        $date->add(new DateInterval('PT'.$dureeSecondes.'S'));
                        if($i == 1)
                            echo("<tbody><tr><td>".$i." <img class='medaille' src='Sprites/Medals/flatshadow_medal8.png' title='1er !' alt='medaille du 1er au classement'></td><td>".$row["pseudo"]."</td> <td>".$row["vague"]."</td> <td>".$date->format('H:i:s')."</td> <td>".$row["temps"]."</td></tr>");
                        else if($i == 2)
                            echo("<tr><td>".$i." <img class='medaille' src='Sprites/Medals/flatshadow_medal3.png' title='2eme' alt='medaille du 2nd au classement'></td><td>".$row["pseudo"]."</td> <td>".$row["vague"]."</td> <td>".$date->format('H:i:s')."</td> <td>".$row["temps"]."</td></tr>");
                        else if($i == 3)
                            echo("<tr><td>".$i." <img class='medaille' src='Sprites/Medals/flatshadow_medal2.png' title='3eme' alt='medaille du 3eme au classement'></td><td>".$row["pseudo"]."</td> <td>".$row["vague"]."</td> <td>".$date->format('H:i:s')."</td> <td>".$row["temps"]."</td></tr>");
                        else
                            echo("<tr><td>".$i."</td><td>".$row["pseudo"]."</td> <td>".$row["vague"]."</td> <td>".$date->format('H:i:s')."</td> <td>".$row["temps"]."</td></tr>");
                        $i++;
                    } echo'</tbody>';
                ?>
            </table>
        </div>
        
        <?php
            if( isset($_SESSION['pseudo']) )
                echo'<form action="index.php"> <input id="bouton_rejouer" type="submit" value="Rejouer"></form>';
        ?>
        
		<footer>
            <p>Site créé par YAGOUB Bassem, tous droits réservés ©.</p>
            <p>Pour tout contact <a href="mailto:yagoub.bassem@gmail.com"> c'est ici</a></p>
        </footer>
		
	</body>
</html>

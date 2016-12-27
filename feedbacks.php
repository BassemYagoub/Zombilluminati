<?php
    session_start();
    include('commenter.php');
?>

<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8"/>
		<title>Zombilluminati Feedbacks</title>
		<link rel="stylesheet" href="design_and_sound/style.css" />
        <link rel="icon" type="image/png" href="design_and_sound/kanyefavicon.png" />
	</head>

	<body>

		<?php include ('header.php'); ?>
		
		<main>
            <?php
                commenter();
                inserer_commentaire();
                affiche_commentaires();			
            ?>
		</main>
        
		<footer>
			<p>Site créé par YAGOUB Bassem, tous droits réservés ©.</p>
			<p>Pour tout contact <a href="mailto:yagoub.bassem@gmail.com"> c'est ici</a></p>
		</footer>
        
	</body>
    
</html>

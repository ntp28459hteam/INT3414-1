<?php
if (isset($_POST) && !empty($_FILES['file'])) {

        if (move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/'. $_FILES['file']['name'])) {
            die('uploads/'. $_FILES['file']['name']);
        } else {
            die(-1);
        }
} else {
    die('Lock');
}
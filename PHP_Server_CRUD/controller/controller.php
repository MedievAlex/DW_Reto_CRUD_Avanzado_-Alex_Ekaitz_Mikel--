<?php
require_once '../Config/Database.php';
require_once '../model/DBImplementation.php';

class controller
{
    private $DBImplementation;

    public function __construct()
    {
        $database = new Database();
        $db = $database->getConnection();
        $this->DBImplementation = new DBImplementation($db);
    }

    // ========== PROFILES ==========

    public function loginUser($username, $password)
    {
        return $this->DBImplementation->loginUser($username, $password);
    }

    public function loginAdmin($username, $password)
    {
        return $this->DBImplementation->loginAdmin($username, $password);
    }

    public function checkUser($username, $password)
    {
        return $this->DBImplementation->checkUser($username, $password);
    }

    public function create_user($username, $pswd1)
    {
        return $this->DBImplementation->create_user($username, $pswd1);
    }

    public function get_all_users()
    {
        return $this->DBImplementation->get_all_users();
    }

    public function modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code)
    {
        return $this->DBImplementation->modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code);
    }

    public function modifyAdmin($email, $username, $telephone, $name, $surname, $current_account, $profile_code)
    {
        return $this->DBImplementation->modifyAdmin($email, $username, $telephone, $name, $surname, $current_account, $profile_code);
    }

    public function delete_user($id)
    {
        return $this->DBImplementation->delete_user($id);
    }

    public function modifyPassword($profile_code, $password)
    {
        return $this->DBImplementation->modifyPassword($profile_code, $password);
    }

    // ========== VIDEOGAMES ==========
    public function get_videogames()
    {
        return $this->DBImplementation->get_videogames();
    }

    public function get_videogame($id)
    {
        return $this->DBImplementation->get_videogame($id);
    }

    public function create_videogame($videogame)
    {
        return $this->DBImplementation->create_videogame($videogame);
    }

    public function update_videogame($videogame)
    {
        return $this->DBImplementation->update_videogame($videogame);
    }

    public function delete_videogame($id)
    {
        return $this->DBImplementation->delete_videogame($id);
    }

    // ========== REVIEWS ==========
    public function get_reviews()
    {
        return $this->DBImplementation->get_reviews();
    }

    public function get_review($pcode, $vcode)
    {
        return $this->DBImplementation->get_review($pcode, $vcode);
    }

    public function create_review($review)
    {
        return $this->DBImplementation->create_review($review);
    }

    public function update_review($review)
    {
        return $this->DBImplementation->update_review($review);
    }

    public function delete_review($pcode, $vcode)
    {
        return $this->DBImplementation->delete_review($pcode, $vcode);
    }

    // ========== LISTS ==========
    public function get_lists($pcode)
    {
        return $this->DBImplementation->get_lists($pcode);
    }

    public function get_list($pcode, $list)
    {
        return $this->DBImplementation->get_list($pcode, $list);
    }

    public function create_list($listed)
    {
        return $this->DBImplementation->create_list($listed);
    }

    public function update_list($pcode, $old_list, $new_list)
    {
        return $this->DBImplementation->update_list($pcode, $old_list, $new_list);
    }

    public function delete_list($pcode, $list)
    {
        return $this->DBImplementation->delete_list($pcode, $list);
    }

    public function delete_game_list($pcode, $vcode, $list)
    {
        return $this->DBImplementation->delete_game_list($pcode, $vcode, $list);
    }
}

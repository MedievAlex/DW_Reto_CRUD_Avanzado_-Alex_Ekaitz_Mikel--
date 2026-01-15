<?php
require_once '../Config/Database.php';
require_once '../model/UserModel.php';

class controller
{
    private $UserModel;

    public function __construct()
    {
        $database = new Database();
        $db = $database->getConnection();
        $this->UserModel = new UserModel($db);
    }

    public function loginUser($username, $password)
    {
        return $this->UserModel->loginUser($username, $password);
    }

    public function loginAdmin($username, $password)
    {
        return $this->UserModel->loginAdmin($username, $password);
    }

    public function checkUser($username, $password)
    {
        return $this->UserModel->checkUser($username, $password);
    }

    public function create_user($username, $pswd1)
    {
        return $this->UserModel->create_user($username, $pswd1);
    }

    public function get_all_users()
    {
        return $this->UserModel->get_all_users();
    }

    public function modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code)
    {
        return $this->UserModel->modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code);
    }

    public function modifyAdmin($email, $username, $telephone, $name, $surname, $current_account, $profile_code)
    {
        return $this->UserModel->modifyAdmin($email, $username, $telephone, $name, $surname, $current_account, $profile_code);
    }

    public function delete_user($id)
    {
        return $this->UserModel->delete_user($id);
    }

    public function modifyPassword($profile_code, $password)
    {
        return $this->UserModel->modifyPassword($profile_code, $password);
    }

    public function get_videogames()
    {
        return $this->UserModel->get_videogames();
    }

    public function get_reviews()
    {
        return $this->UserModel->get_reviews();
    }

    public function get_lists()
    {
        return $this->UserModel->get_lists();
    }

    public function get_videogame($id)
    {
        return $this->UserModel->get_videogame($id);
    }

    public function create_videogame($videogame) {}
    public function update_videogame($videogame) {}
    public function delete_videogame($id) {}

    public function get_review($pcode, $vcode)
    {
        return $this->UserModel->get_review($pcode, $vcode);
    }

    public function create_review($review) {}
    public function update_review($review) {}
    public function delete_review($id) {}

    public function get_list($pcode, $list)
    {
        return $this->UserModel->get_list($pcode, $list);
    }

    public function create_list($list) {}
    public function update_list($list) {}
    public function delete_list($list) {}
}

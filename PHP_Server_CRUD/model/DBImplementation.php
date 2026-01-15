<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'User.php';
require_once 'Admin.php';

class DBImplementation
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function loginUser($username, $password)
  {
    $query = "SELECT * FROM PROFILE_ P JOIN USER_ U ON P.PROFILE_CODE = U.PROFILE_CODE
            WHERE USER_NAME = :username";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
      if (password_verify($password, $result['PSWD'])) {
        return $result;
      }
    }

    return null;
  }

  public function loginAdmin($username, $password)
  {
    $query = "SELECT * FROM PROFILE_ P JOIN ADMIN_ A ON P.PROFILE_CODE=A.PROFILE_CODE
            WHERE USER_NAME = :username";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
      if (password_verify($password, $result['PSWD'])) {
        return $result;
      }
    }

    return null;
  }

  public function checkUser($username, $password)
  {
    $query = "SELECT * FROM PROFILE_ P JOIN USER_ U ON P.PROFILE_CODE = U.PROFILE_CODE
            WHERE USER_NAME = :username";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && password_verify($password, $result['PSWD'])) {
      return false;
    }

    $query = "SELECT * FROM PROFILE_ P JOIN ADMIN_ A ON P.PROFILE_CODE=A.PROFILE_CODE
            WHERE USER_NAME = :username";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":username", $username);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && password_verify($password, $result['PSWD'])) {
      return true;
    }

    return "There was an error when processing the profile.";
  }

  public function create_user($username, $pswd)
  {
    $checkQuery = "SELECT * FROM PROFILE_ WHERE USER_NAME = ?";
    $checkStmt = $this->conn->prepare($checkQuery);
    $checkStmt->bindValue(1, $username);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
      return null;
    }

    $hashedPassword = password_hash($pswd, PASSWORD_DEFAULT);

    $createQuery = "CALL RegistrarUsuario(?, ?)";
    $createStmt = $this->conn->prepare($createQuery);
    $createStmt->bindValue(1, $username);
    $createStmt->bindValue(2, $hashedPassword);
    $createStmt->execute();
    $result = $createStmt->fetch(PDO::FETCH_ASSOC);
    return $result;
  }

  public function get_all_users()
  {
    $query = "SELECT * FROM PROFILE_ AS P, USER_ AS U WHERE P.PROFILE_CODE = U.PROFILE_CODE";

    $stmt = $this->conn->prepare($query);

    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }

  public function delete_user($id)
  {
    $query = "DELETE U, P FROM USER_ U JOIN PROFILE_ P ON P.PROFILE_CODE = U.PROFILE_CODE WHERE P.PROFILE_CODE = :id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
      return TRUE;
    } else {
      return FALSE;
    }
  }

  public function modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code)
  {
    $query = "UPDATE USER_ U JOIN PROFILE_ P ON U.PROFILE_CODE = P.PROFILE_CODE
        SET P.EMAIL = :email, P.USER_NAME = :username, P.TELEPHONE = :telephone, P.NAME_ = :name_, P.SURNAME = :surname, U.GENDER = :gender, U.CARD_NO = :card_no
        WHERE P.PROFILE_CODE = :profile_code";

    $stmt = $this->conn->prepare($query);
    $stmt->bindparam(':email', $email);
    $stmt->bindparam(':username', $username);
    $stmt->bindparam(':telephone', $telephone);
    $stmt->bindparam(':name_', $name);
    $stmt->bindparam(':surname', $surname);
    $stmt->bindparam(':gender', $gender);
    $stmt->bindparam(':card_no', $card_no);
    $stmt->bindparam(':profile_code', $profile_code);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  public function modifyAdmin($email, $username, $telephone, $name, $surname, $current_account, $profile_code)
  {
    $query = "UPDATE ADMIN_ A JOIN PROFILE_ P ON A.PROFILE_CODE = P.PROFILE_CODE
        SET P.EMAIL = :email, P.USER_NAME = :username, P.TELEPHONE = :telephone, P.NAME_ = :name_, P.SURNAME = :surname, A.CURRENT_ACCOUNT = :current_account
        WHERE P.PROFILE_CODE = :profile_code";

    $stmt = $this->conn->prepare($query);
    $stmt->bindparam(':email', $email);
    $stmt->bindparam(':username', $username);
    $stmt->bindparam(':telephone', $telephone);
    $stmt->bindparam(':name_', $name);
    $stmt->bindparam(':surname', $surname);
    $stmt->bindparam(':current_account', $current_account);
    $stmt->bindparam(':profile_code', $profile_code);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  public function modifyPassword($profile_code, $password)
  {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $query = "UPDATE PROFILE_ SET PSWD = :password_ WHERE PROFILE_CODE = :profile_code";
    $stmt = $this->conn->prepare($query);
    $stmt->bindparam(':profile_code', $profile_code);
    $stmt->bindparam(':password_', $hashedPassword);

    if ($stmt->execute()) {
      return true;
    } else {
      return false;
    }
  }

  // ========== VIDEOGAMES ==========

  public function get_videogames()
  {
    $query = "SELECT * FROM VIDEOGAME_";

    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }

  public function get_videogame($id)
  {
    $query = "SELECT * FROM VIDEOGAME_ WHERE V_CODE = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result;
  }

  public function create_videogame($videogame)
  {
    $query = "INSERT INTO VIDEOGAME_ (V_NAME, V_RELEASE, V_PLATFORM, V_PEGI) VALUES (:name_, :release_, :platform_, :pegi_)";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':name_', $videogame->getName());
    $stmt->bindParam(':release_', $videogame->getRelease());
    $stmt->bindParam(':platform_', $videogame->getPlatform()->name);
    $stmt->bindParam(':pegi_', $videogame->getPegi()->name);

    if ($stmt->execute()) {
      return $this->conn->lastInsertId();
    } else {
      return false;
    }
  }

  public function update_videogame($videogame)
  {
    $query = "UPDATE VIDEOGAME_ SET V_NAME = :name_, V_RELEASE = :release_, V_PLATFORM = :platform_, V_PEGI = :pegi_
WHERE V_CODE = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':id', $videogame->getVideogameCode());
    $stmt->bindParam(':name_', $videogame->getName());
    $stmt->bindParam(':release_', $videogame->getRelease());
    $stmt->bindParam(':platform_', $videogame->getPlatform()->name);
    $stmt->bindParam(':pegi_', $videogame->getPegi()->name);

    return $stmt->execute();
  }

  public function delete_videogame($id)
  {
    $query = "DELETE FROM VIDEOGAME_ WHERE V_CODE = :id";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    return $stmt->rowCount() > 0;
  }

  // ========== REVIEWS ==========

  public function get_reviews()
  {
    $query = "SELECT * FROM REVIEW_";

    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }

  public function get_review($pcode, $vcode)
  {
    $query = "SELECT * FROM REVIEW_ WHERE PROFILE_CODE = :pcode AND V_CODE = :vcode";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $pcode);
    $stmt->bindParam(':vcode', $vcode);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result;
  }

  public function create_review($review)
  {
    $query = "INSERT INTO REVIEW_ (PROFILE_CODE, V_CODE, R_SCORE, R_DESCRIPTION, R_DATE) VALUES (:pcode, :vcode, :score, :description_, :date_)";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $review->getProfileCode());
    $stmt->bindParam(':vcode', $review->getVCode());
    $stmt->bindParam(':score', $review->getScore());
    $stmt->bindParam(':description_', $review->getDescription());
    $stmt->bindParam(':date_', $review->getDate());

    if ($stmt->execute()) {
      return [
        'profile_code' => $review->getProfileCode(),
        'videogame_code' => $review->getVCode()
      ];
    }
    return false;
  }

  public function update_review($review)
  {
    $query = "UPDATE REVIEW_ SET R_SCORE = :score, R_DESCRIPTION = :description_, R_DATE = :date_ WHERE PROFILE_CODE = :pcode AND V_CODE = :vcode";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $review->getProfileCode());
    $stmt->bindParam(':vcode', $review->getVCode());
    $stmt->bindParam(':score', $review->getScore());
    $stmt->bindParam(':description_', $review->getDescription());
    $stmt->bindParam(':date_', $review->getDate());

    return $stmt->execute();
  }

  public function delete_review($pcode, $vcode)
  {
    $query = "DELETE FROM REVIEW_ WHERE PROFILE_CODE = :pcode AND V_CODE = :vcode";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $pcode);
    $stmt->bindParam(':vcode', $vcode);
    $stmt->execute();

    return $stmt->rowCount() > 0;
  }

  // ========== LISTS ==========

  public function get_lists($pcode)
  {
    $query = "SELECT DISTINCT L_NAME FROM LISTED_ WHERE PROFILE_CODE = :pcode";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $pcode);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }

  public function get_list($pcode, $list)
  {
    $query = "SELECT * FROM LISTED_ WHERE PROFILE_CODE = :pcode AND L_NAME = :list";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $pcode);
    $stmt->bindParam(':list', $list);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $result;
  }

  public function create_list($listed)
  {
    $query = "INSERT INTO LISTED_ (PROFILE_CODE, V_CODE, L_NAME) VALUES (:pcode, :vcode, :l_name)";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $listed->getProfileCode());
    $stmt->bindParam(':vcode', $listed->getVideogameCode());
    $stmt->bindParam(':l_name', $listed->getListName());

    if ($stmt->execute()) {
      return [
        'profile_code' => $listed->getProfileCode(),
        'videogame_code' => $listed->getVideogameCode(),
        'list_name' => $listed->getListName()
      ];
    }
    return false;
  }

  public function update_list($pcode, $old_list, $new_list)
  {
    $query = "UPDATE LISTED_ SET L_NAME = :new_list WHERE PROFILE_CODE = :pcode AND L_NAME = :old_list";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $pcode);
    $stmt->bindParam(':old_list', $old_list);
    $stmt->bindParam(':new_list', $new_list);

    return $stmt->execute();
  }

  public function delete_list($pcode, $list)
  {
    $query = "DELETE FROM LISTED_ WHERE PROFILE_CODE = :pcode AND L_NAME = :list";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $pcode);
    $stmt->bindParam(':list', $list);
    $stmt->execute();

    return $stmt->rowCount() > 0;
  }

  public function delete_game_list($pcode, $vcode, $list)
  {
    $query = "DELETE FROM LISTED_ WHERE PROFILE_CODE = :pcode AND V_CODE = :vcode AND L_NAME = :list";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(':pcode', $pcode);
    $stmt->bindParam(':vcode', $vcode);
    $stmt->bindParam(':list', $list);
    $stmt->execute();

    return $stmt->rowCount() > 0;
  }
}

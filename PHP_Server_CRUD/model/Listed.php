<?php

class Listed
{
  private $profile_code;
  private $v_code;
  private $name;

  public function __construct($profile_code, $v_code, $name)
  {
    $this->profile_code = $profile_code;
    $this->v_code = $v_code;
    $this->name = $name;
  }
  public function getProfileCode()
  {
    return $this->profile_code;
  }
  public function setProfileCode($profile_code)
  {
    $this->profile_code = $profile_code;
  }
  public function getVCode()
  {
    return $this->v_code;
  }
  public function setVCode($v_code)
  {
    $this->v_code = $v_code;
  }
  public function getName()
  {
    return $this->name;
  }
  public function setName($name)
  {
    $this->name = $name;
  }
  public function __toString()
  {
    return "List: Profile Code: " . $this->profile_code . " - Videogame code: " . $this->v_code . " - Name: " . $this->name;
  }
}
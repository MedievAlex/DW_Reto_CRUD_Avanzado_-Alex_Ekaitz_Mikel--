<?php

class Review
{
  private $profile_code;
  private $v_code;
  private $score;
  private $description;
  private $date;

  public function __construct($profile_code, $v_code, $score, $description, $date)
  {
    $this->profile_code = $profile_code;
    $this->v_code = $v_code;
    $this->score = $score;
    $this->description = $description;
    $this->date = $date;
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
  public function getScore()
  {
    return $this->score;
  }
  public function setScore($score)
  {
    $this->score = $score;
  }
  public function getDescription()
  {
    return $this->description;
  }
  public function setDescription($description)
  {
    $this->description = $description;
  }
  public function getDate()
  {
    return $this->date;
  }
  public function setDate($date)
  {
    $this->date = $date;
  }
  public function __toString()
  {
    return "Review: Profile Code: " . $this->profile_code . " - Videogame code: " . $this->v_code . " - Score: " . $this->score . "/10 - Description: " . $this->description . "- Date: " . $this->date;
  }
}
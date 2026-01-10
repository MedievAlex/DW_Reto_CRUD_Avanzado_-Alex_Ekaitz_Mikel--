<?php

class Videogame
{
  private $name;
  private $date;
  private $platform;
  private $pegi;

  public function __construct($name, $date, $platform, $pegi)
  {
    $this->name = $name;
    $this->date = $date;
    $this->platform = $platform;
    $this->pegi = $pegi;
  }
  public function getName()
  {
    return $this->name;
  }
  public function setName($name)
  {
    $this->name = $name;
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
    return "Videogame: Name: " . $this->name . " - Date: " . $this->date . " - Platform: " . $this->platform . " - Pegi: " . $this->pegi;
  }
}

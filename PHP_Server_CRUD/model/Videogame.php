<?php

class Videogame
{
  private $name;
  private $release;
  private $platform;
  private $pegi;

  public function __construct($name, $release, $platform, $pegi)
  {
    $this->name = $name;
    $this->release = $release;
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
  public function getRelease()
  {
    return $this->release;
  }
  public function setRelease($release)
  {
    $this->release = $release;
  }
  public function getPlatform()
  {
    return $this->platform;
  }
  public function setPlatform($platform)
  {
    $this->platform = $platform;
  }
  public function getPegi()
  {
    return $this->pegi;
  }
  public function setPegi($pegi)
  {
    $this->pegi = $pegi;
  }
  public function __toString()
  {
    return "Videogame: Name: " . $this->name . " - Release date: " . $this->release . " - Platform: " . $this->platform . " - Pegi: " . $this->pegi;
  }
}

<?php
enum Pegi: string
{
  case PEGI3  = 'PEGI3';
  case PEGI6  = 'PEGI6';
  case PEGI12 = 'PEGI12';
  case PEGI16 = 'PEGI16';
  case PEGI18 = 'PEGI18';
  case DEFAULT = 'DEFAULT';
}

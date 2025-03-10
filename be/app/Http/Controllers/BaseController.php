<?php

namespace App\Http\Controllers;

use Doctrine\ORM\EntityManagerInterface;

abstract class BaseController extends Controller
{
    public function __construct(protected EntityManagerInterface $em)
    {
    }
}

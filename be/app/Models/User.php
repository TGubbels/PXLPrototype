<?php

namespace App\Models;

use Doctrine\ORM\Mapping as ORM;
use Illuminate\Support\Facades\Hash;
use LaravelDoctrine\ORM\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

#[ORM\Entity]
#[ORM\Table(name: 'users')]
class User implements AuthenticatableContract
{
    use Authenticatable;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    protected int $id;

    #[ORM\Column(type: 'string')]
    protected string $name;

    #[ORM\Column(type: 'string', unique: true)]
    protected string $email;

    #[ORM\Column(type: 'string')]
    protected string $password;

    #[ORM\Column(type: 'datetime', nullable: true)]
    protected ?\DateTime $email_verified_at = null;

    #[ORM\Column(type: 'string', nullable: true)]
    protected ?string $remember_token = null;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function setPassword(string $password): void
    {
        $this->password = Hash::make($password);
    }
    public function getPassword(): string
    {
        return $this->password;
    }
    public function validatePassword(string $password): bool
    {
        return Hash::check($password, $this->password);
    }
}

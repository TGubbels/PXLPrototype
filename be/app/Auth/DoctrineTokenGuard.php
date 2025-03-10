<?php

namespace App\Auth;

use App\Models\PersonalAccessToken;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Authenticatable;
use Doctrine\ORM\EntityManagerInterface;

class DoctrineTokenGuard implements Guard
{
    protected $em;
    protected $request;
    protected $user;

    public function __construct(EntityManagerInterface $em, Request $request)
    {
        $this->em = $em;
        $this->request = $request;
    }

    public function user(): ?Authenticatable
    {
        if ($this->user) {
            return $this->user;
        }

        $token = $this->request->bearerToken();
        if (!$token) {
            return null;
        }

        $accessToken = $this->em->getRepository(PersonalAccessToken::class)
            ->findOneBy(['token' => hash('sha256', explode('|', $token)[1])]);

        if (!$accessToken) {
            return null;
        }

        $userClass = $accessToken->getTokenableType();
        $this->user = $this->em->getRepository($userClass)
            ->find($accessToken->getTokenableId());

        return $this->user;
    }

    public function validate(array $credentials = []): bool
    {
        return false;
    }

    public function check(): bool
    {
        return $this->user() !== null;
    }

    public function guest(): bool
    {
        return !$this->check();
    }

    public function id()
    {
        return $this->user()?->getId();
    }

    public function setUser(Authenticatable $user)
    {
        $this->user = $user;
    }
}

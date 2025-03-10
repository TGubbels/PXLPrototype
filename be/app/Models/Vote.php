<?php

namespace App\Models;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'votes')]
class Vote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\ManyToOne(targetEntity: Comment::class, inversedBy: 'votes')]
    #[ORM\JoinColumn(nullable: false)]
    private Comment $comment;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\Column(type: 'boolean')]
    private bool $isUpvote;

    public function __construct(Comment $comment, User $user, bool $isUpvote)
    {
        $this->comment = $comment;
        $this->user = $user;
        $this->isUpvote = $isUpvote;
    }

    public function isUpvote(): bool
    {
        return $this->isUpvote;
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoteCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_upvote' => 'required|boolean'
        ];
    }

    public function isUpvote(): bool
    {
        return $this->validated()['is_upvote'];
    }
}

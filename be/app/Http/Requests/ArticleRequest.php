<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ];
    }

    public function getTitle(): string
    {
        return $this->validated()['title'];
    }

    public function getContent(bool $asResource = false): string
    {
        return $this->validated()['content'];
    }
}

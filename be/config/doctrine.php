<?php

return [
    'managers' => [
        'default' => [
            'dev' => env('APP_DEBUG', false),
            'meta' => 'attributes',
            'connection' => env('DB_CONNECTION', 'mysql'),
            'namespaces' => [],
            'paths' => [
                base_path('app/Models')
            ],
            'repository' => Doctrine\ORM\EntityRepository::class,
            'proxies' => [
                'namespace' => 'DoctrineProxies',
                'path' => storage_path('proxies'),
                'auto_generate' => env('DOCTRINE_PROXY_AUTOGENERATE', false)
            ],
            'events' => [
                'listeners' => [],
                'subscribers' => []
            ],
            'filters' => [],
            'mapping_types' => [],
            'driver' => env('DOCTRINE_DRIVER', 'orm')
        ]
    ]
];

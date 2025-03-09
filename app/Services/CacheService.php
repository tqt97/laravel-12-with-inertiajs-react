<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    protected string $cacheDriver;
    protected int $defaultTTL;

    public function __construct()
    {
        $this->cacheDriver = config('cache.default');
        $this->defaultTTL = config('cache.default_ttl', 3600);
    }

    public function getDefaultTTL(): int
    {
        return $this->defaultTTL;
    }

    public function remember(string $key, ?int $ttl, callable $callback)
    {
        return Cache::remember($key, $ttl ?? $this->defaultTTL, $callback);
    }

    public function forget(array $keys, string $prefix = ''): void
    {
        if ($this->cacheDriver === 'redis') {
            Cache::tags([$prefix])->flush();
        } else {
            foreach ($keys as $key) {
                Cache::forget("{$prefix}:{$key}");
            }
        }
    }
}

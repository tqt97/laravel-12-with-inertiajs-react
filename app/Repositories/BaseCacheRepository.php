<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

abstract class BaseCacheRepository extends BaseRepository
{
    public function __construct(Model $model, protected string $cacheKeyPrefix, protected int $cacheTTL = 3600)
    {
        parent::__construct($model);
    }

    public function getAll(): Collection
    {
        return Cache::remember("{$this->cacheKeyPrefix}:all", $this->cacheTTL, fn () => parent::getAll());
    }

    public function getAllWithColumns(array $columns = ['*']): Collection
    {
        return Cache::remember("{$this->cacheKeyPrefix}:allWithColumns", $this->cacheTTL, fn () => parent::getAllWithColumns($columns));
    }

    public function create(array $data): Model
    {
        $result = parent::create($data);
        $this->clearCache();

        return $result;
    }

    public function update(Model $model, array $data): bool
    {
        $result = parent::update($model, $data);
        $this->clearCache();

        return $result;
    }

    public function delete(Model $model): bool
    {
        $result = parent::delete($model);
        $this->clearCache();

        return $result;
    }

    protected function clearCache(): void
    {
        Cache::forget("{$this->cacheKeyPrefix}:all");
    }
}

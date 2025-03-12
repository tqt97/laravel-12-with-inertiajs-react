<?php

declare(strict_types=1);

namespace App\Repositories\Permission;

use App\Services\CacheService;
use Illuminate\Database\Eloquent\Collection;

class CachedPermissionRepository implements PermissionRepositoryInterface
{
    private const DEFAULT_TTL = 1800; // or null
    protected string $cacheKeyPrefix = 'permissions';
    protected ?int $cacheTTL;

    public function __construct(
        protected PermissionRepositoryInterface $repository,
        protected CacheService $cacheService
    ) {
        $this->cacheTTL = self::DEFAULT_TTL ?? $this->cacheService->getDefaultTTL();
    }

    public function getAll(): Collection
    {
        return $this->cacheService->remember("{$this->cacheKeyPrefix}:all", $this->cacheTTL, fn () => $this->repository->getAll());
    }

    public function getAllWithColumns(array $columns = ['*']): Collection
    {
        return $this->cacheService->remember("{$this->cacheKeyPrefix}:allWithColumns", $this->cacheTTL, fn () => $this->repository->getAllWithColumns($columns));
    }

    public function create(array $data)
    {
        $result = $this->repository->create($data);
        $this->cacheService->forget(['all', 'allWithColumns'], $this->cacheKeyPrefix);

        return $result;
    }

    public function update($model, array $data)
    {
        $result = $this->repository->update($model, $data);
        $this->cacheService->forget(['all', 'allWithColumns', "id:{$model->id}"], $this->cacheKeyPrefix);

        return $result;
    }

    public function delete($model)
    {
        $result = $this->repository->delete($model);
        $this->cacheService->forget(['all', 'allWithColumns', "id:{$model->id}"], $this->cacheKeyPrefix);

        return $result;
    }
}

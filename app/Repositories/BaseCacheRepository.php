<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Services\CacheService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseCacheRepository implements BaseRepositoryInterface
{
    protected string $cacheKeyPrefix;
    protected ?int $cacheTTL;

    public function __construct(
        protected BaseRepositoryInterface $repository,
        protected CacheService $cacheService
    ) {
        $this->cacheKeyPrefix = strtolower(class_basename($this->repository::class)); // e.g., "permission"
        $this->cacheTTL = $this->cacheService->getDefaultTTL();
    }

    public function getAll(): Collection
    {
        return $this->cacheService->remember(
            "{$this->cacheKeyPrefix}:all",
            $this->cacheTTL,
            fn () => $this->repository->getAll()
        );
    }

    public function getAllWithColumns(array $columns = ['*']): Collection
    {
        return $this->cacheService->remember(
            "{$this->cacheKeyPrefix}:allWithColumns:".implode(',', $columns),
            $this->cacheTTL,
            fn () => $this->repository->getAllWithColumns($columns)
        );
    }

    // public function findById(int $id): ?Model
    // {
    //     return $this->cacheService->remember(
    //         "{$this->cacheKeyPrefix}:id:{$id}",
    //         $this->cacheTTL,
    //         fn () => $this->repository->findById($id)
    //     );
    // }

    public function create(array $data): Model
    {
        $result = $this->repository->create($data);
        $this->invalidateCache();

        return $result;
    }

    public function update(Model $model, array $data): bool
    {
        $result = $this->repository->update($model, $data);
        $this->invalidateCache($model->id);

        return $result;
    }

    public function delete(Model $model): bool
    {
        $result = $this->repository->delete($model);
        $this->invalidateCache($model->id);

        return $result;
    }

    protected function invalidateCache(?int $id = null): void
    {
        $keys = ['all', 'allWithColumns'];

        if ($id !== null) {
            $keys[] = "id:{$id}";
        }

        $this->cacheService->forget($keys, $this->cacheKeyPrefix);
    }
}
